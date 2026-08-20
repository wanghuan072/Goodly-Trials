"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import UnitSprite from "@/components/content/UnitSprite";
import type { FactionSlug, Item, UnitStats } from "@/types/content";
import styles from "@/style/page/builder/builder.module.css";

export type BuilderRosterUnit = {
  slug: string;
  name: string;
  faction: string;
  factionSlug: FactionSlug;
  accent: string;
  image: string;
  verified: boolean;
  gear?: number;
  trinkets?: number;
  stats?: UnitStats;
  trait?: string;
  traitEffect?: string;
  tactic?: string;
  tacticEffect?: string;
  skills?: { name: string; effect: string }[];
  quote?: string;
  recovery?: string;
  manaRegen?: string;
};

export type BuilderLeader = {
  slug: string;
  name: string;
  epithet: string;
  faction: string;
  factionSlug: FactionSlug;
  trait: { name: string; effect: string };
  stats: Pick<UnitStats, "es" | "hp" | "mp" | "str" | "agi" | "int">;
};

type BuilderSlot = { unitSlug: string; itemSlugs: string[] };
type BuilderState = { title: string; mode: string; leaderSlug: string; slots: BuilderSlot[]; notes: string };
type CatalogTab = "units" | "items" | "leaders";
type PendingPick = { kind: "unit" | "item"; slug: string } | null;
type DragPayload = { kind: "unit" | "item" | "leader" | "slot"; slug?: string; from?: number };
type EquipmentKind = "gear" | "trinkets" | "consumable";

const STORAGE_KEY = "goodly-trials-company-builder-v1";
const DRAG_TYPE = "application/x-goodly-builder";
const MODES = ["Theorycraft", "Single-player", "Ranked", "Multiplayer"];
const BOARD_COLUMNS = 6;
const BOARD_ROWS = 4;
const BOARD_CELLS = BOARD_COLUMNS * BOARD_ROWS;
const LEGACY_SLOT_POSITIONS = [9, 10, 14, 15, 20, 21];

function emptySlots(): BuilderSlot[] {
  return Array.from({ length: BOARD_CELLS }, () => ({ unitSlug: "", itemSlugs: [] }));
}

function emptyBuild(): BuilderState {
  return { title: "Untitled Company", mode: "Theorycraft", leaderSlug: "", slots: emptySlots(), notes: "" };
}

function encodeBuild(build: BuilderState) {
  const bytes = new TextEncoder().encode(JSON.stringify(build));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBuild(value: string): BuilderState | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Partial<BuilderState>;
    const sourceSlots = Array.isArray(parsed.slots) ? parsed.slots.slice(0, BOARD_CELLS).map((slot) => ({
      unitSlug: typeof slot?.unitSlug === "string" ? slot.unitSlug : "",
      itemSlugs: Array.isArray(slot?.itemSlugs) ? slot.itemSlugs.filter((slug): slug is string => typeof slug === "string").slice(0, 8) : [],
    })) : [];
    const slots = emptySlots();
    if (sourceSlots.length <= 6) {
      sourceSlots.forEach((slot, index) => { slots[LEGACY_SLOT_POSITIONS[index]] = slot; });
    } else {
      sourceSlots.forEach((slot, index) => { slots[index] = slot; });
    }
    return {
      title: typeof parsed.title === "string" ? parsed.title.slice(0, 64) : "Untitled Company",
      mode: MODES.includes(parsed.mode ?? "") ? parsed.mode as string : "Theorycraft",
      leaderSlug: typeof parsed.leaderSlug === "string" ? parsed.leaderSlug : "",
      slots,
      notes: typeof parsed.notes === "string" ? parsed.notes.slice(0, 280) : "",
    };
  } catch {
    return null;
  }
}

function itemSlotUse(item: Item) {
  if (item.type.startsWith("Potion")) return { gear: 0, trinkets: 0 };
  if (item.type.startsWith("Trinket") || item.type.startsWith("Spell")) return { gear: 0, trinkets: 1 };
  return { gear: item.type.startsWith("Two-handed") ? 2 : 1, trinkets: 0 };
}

function itemKind(item: Item): EquipmentKind {
  if (item.type.startsWith("Potion")) return "consumable";
  return item.type.startsWith("Trinket") || item.type.startsWith("Spell") ? "trinkets" : "gear";
}

function writeDrag(event: DragEvent, payload: DragPayload) {
  const encoded = JSON.stringify(payload);
  event.dataTransfer.effectAllowed = payload.kind === "slot" || payload.from !== undefined ? "move" : "copy";
  event.dataTransfer.setData(DRAG_TYPE, encoded);
  event.dataTransfer.setData("text/plain", encoded);
}

function readDrag(event: DragEvent): DragPayload | null {
  try {
    const value = event.dataTransfer.getData(DRAG_TYPE) || event.dataTransfer.getData("text/plain");
    return JSON.parse(value) as DragPayload;
  } catch {
    return null;
  }
}

function ResourceBar({ label, value, suffix, maximum }: { label: string; value: number; suffix?: string; maximum: number }) {
  return <div className={styles.resourceRow}><b>{label}</b><span><i style={{ width: `${Math.min(100, Math.max(2, value / maximum * 100))}%` }} /></span><strong>{value}</strong><small>{suffix}</small></div>;
}

export default function BuilderClient({ roster, leaders, items }: { roster: BuilderRosterUnit[]; leaders: BuilderLeader[]; items: Item[] }) {
  const [build, setBuild] = useState<BuilderState>(emptyBuild);
  const [ready, setReady] = useState(false);
  const [activeSlot, setActiveSlot] = useState(0);
  const [tab, setTab] = useState<CatalogTab>("units");
  const [query, setQuery] = useState("");
  const [faction, setFaction] = useState("all");
  const [message, setMessage] = useState("Drag a unit into the board");
  const [pendingPick, setPendingPick] = useState<PendingPick>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  const unitBySlug = useMemo(() => new Map(roster.map((unit) => [unit.slug, unit])), [roster]);
  const itemBySlug = useMemo(() => new Map(items.map((item) => [item.slug, item])), [items]);
  const leaderBySlug = useMemo(() => new Map(leaders.map((leader) => [leader.slug, leader])), [leaders]);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const hashValue = window.location.hash.startsWith("#b=") ? window.location.hash.slice(3) : "";
      const imported = hashValue ? decodeBuild(hashValue) : null;
      const saved = !imported ? decodeBuild(window.localStorage.getItem(STORAGE_KEY) ?? "") : null;
      const next = imported ?? saved ?? emptyBuild();
      setBuild(next);
      if (window.location.hash || window.location.search) window.history.replaceState(null, "", window.location.pathname);
      setReady(true);
      setMessage(imported ? "Company imported and saved on this device" : saved ? "Local company restored" : "Drag a unit into the board");
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const encoded = encodeBuild(build);
    window.localStorage.setItem(STORAGE_KEY, encoded);
  }, [build, ready]);

  const selectedLeader = leaderBySlug.get(build.leaderSlug);
  const selectedSlots = build.slots;
  const filledCount = selectedSlots.filter((slot) => slot.unitSlug).length;
  const hoveredUnit = hoveredSlot === null ? undefined : unitBySlug.get(build.slots[hoveredSlot]?.unitSlug ?? "");
  const hoveredCellLabel = hoveredSlot === null ? "" : `${String.fromCharCode(65 + Math.floor(hoveredSlot / BOARD_COLUMNS))}${hoveredSlot % BOARD_COLUMNS + 1}`;
  const itemCost = selectedSlots.reduce((total, slot) => total + slot.itemSlugs.reduce((sum, slug) => sum + (itemBySlug.get(slug)?.cost ?? 0), 0), 0);
  const queryText = query.trim().toLowerCase();
  const filteredUnits = roster.filter((unit) => (faction === "all" || unit.factionSlug === faction) && (!queryText || `${unit.name} ${unit.faction} ${unit.trait ?? ""}`.toLowerCase().includes(queryText)));
  const filteredItems = items.filter((item) => !queryText || `${item.name} ${item.type} ${item.effects.join(" ")}`.toLowerCase().includes(queryText));
  const filteredLeaders = leaders.filter((leader) => (faction === "all" || leader.factionSlug === faction) && (!queryText || `${leader.name} ${leader.epithet} ${leader.faction} ${leader.trait.name}`.toLowerCase().includes(queryText)));

  function updateSlot(index: number, next: BuilderSlot) {
    setBuild((current) => ({ ...current, slots: current.slots.map((slot, slotIndex) => slotIndex === index ? next : slot) }));
  }

  function placeUnit(index: number, slug: string) {
    if (index < 0 || index >= BOARD_CELLS) return;
    updateSlot(index, { unitSlug: slug, itemSlugs: [] });
    setActiveSlot(index);
    setHoveredSlot(index);
    setPendingPick(null);
    setMessage(`${unitBySlug.get(slug)?.name ?? "Unit"} placed in board slot ${index + 1}`);
  }

  function equipItem(index: number, slug: string, from?: number) {
    if (!build.slots[index]?.unitSlug) {
      setMessage("Place a unit in that board slot first");
      return;
    }
    setBuild((current) => {
      const slots = current.slots.map((slot) => ({ ...slot, itemSlugs: [...slot.itemSlugs] }));
      if (from !== undefined && from !== index) slots[from].itemSlugs = slots[from].itemSlugs.filter((itemSlug) => itemSlug !== slug);
      if (!slots[index].itemSlugs.includes(slug)) slots[index].itemSlugs = [...slots[index].itemSlugs, slug].slice(0, 8);
      return { ...current, slots };
    });
    setActiveSlot(index);
    setHoveredSlot(index);
    setPendingPick(null);
    setMessage(`${itemBySlug.get(slug)?.name ?? "Item"} equipped on slot ${index + 1}`);
  }

  function moveBoardSlot(from: number, to: number) {
    if (from === to || to < 0 || to >= BOARD_CELLS) return;
    setBuild((current) => {
      const slots = [...current.slots];
      [slots[from], slots[to]] = [slots[to], slots[from]];
      return { ...current, slots };
    });
    setActiveSlot(to);
    setHoveredSlot(to);
    setMessage(`Board slots ${from + 1} and ${to + 1} swapped`);
  }

  function handleBoardClick(index: number) {
    if (index < 0 || index >= BOARD_CELLS) return;
    if (pendingPick?.kind === "unit") return placeUnit(index, pendingPick.slug);
    if (pendingPick?.kind === "item") return equipItem(index, pendingPick.slug);
    setActiveSlot(index);
    const unit = unitBySlug.get(build.slots[index].unitSlug);
    setHoveredSlot(unit ? index : null);
    setMessage(unit ? `${unit.name} selected · drag equipment here` : `Slot ${index + 1} selected · choose or drag a unit`);
  }

  function handleBoardDrop(index: number, event: DragEvent) {
    event.preventDefault();
    setDropTarget(null);
    if (index < 0 || index >= BOARD_CELLS) return;
    const payload = readDrag(event);
    if (!payload) return;
    if (payload.kind === "unit" && payload.slug) placeUnit(index, payload.slug);
    if (payload.kind === "item" && payload.slug) equipItem(index, payload.slug, payload.from);
    if (payload.kind === "slot" && payload.from !== undefined) moveBoardSlot(payload.from, index);
  }

  function handleLeaderDrop(event: DragEvent) {
    event.preventDefault();
    const payload = readDrag(event);
    if (payload?.kind !== "leader" || !payload.slug) return;
    setBuild((current) => ({ ...current, leaderSlug: payload.slug ?? "" }));
    setMessage(`${leaderBySlug.get(payload.slug)?.name ?? "Leader"} assigned`);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}`);
      setMessage("Clean page link copied · this company stays saved on your device");
    } catch {
      setMessage("Copy was blocked · copy the page URL from your browser");
    }
  }

  function clearBuild() {
    setBuild(emptyBuild());
    setActiveSlot(0);
    setPendingPick(null);
    setTab("units");
    setMessage("Company cleared");
  }

  function removeUnit(index: number) {
    const unitName = unitBySlug.get(build.slots[index]?.unitSlug ?? "")?.name ?? "Unit";
    updateSlot(index, { unitSlug: "", itemSlugs: [] });
    setHoveredSlot((current) => current === index ? null : current);
    setPendingPick(null);
    setMessage(`${unitName} removed from ${String.fromCharCode(65 + Math.floor(index / BOARD_COLUMNS))}${index % BOARD_COLUMNS + 1}`);
  }

  function removeLeader() {
    if (!selectedLeader) return;
    setBuild((current) => ({ ...current, leaderSlug: "" }));
    setMessage(`${selectedLeader.name} removed from the leader slot`);
  }

  function equipmentFor(slot: BuilderSlot, kind: EquipmentKind) {
    return slot.itemSlugs.map((slug) => itemBySlug.get(slug)).filter((item): item is Item => item !== undefined && itemKind(item) === kind);
  }

  function rotateFormationRow(rowIndex: number) {
    const start = rowIndex * BOARD_COLUMNS;
    setBuild((current) => {
      const slots = [...current.slots];
      const last = slots[start + BOARD_COLUMNS - 1];
      for (let offset = BOARD_COLUMNS - 1; offset > 0; offset -= 1) slots[start + offset] = slots[start + offset - 1];
      slots[start] = last;
      return { ...current, slots };
    });
    if (activeSlot >= start && activeSlot < start + BOARD_COLUMNS) setActiveSlot(start + ((activeSlot - start + 1) % BOARD_COLUMNS));
    setMessage(`Formation row ${rowIndex + 1} shifted right`);
  }

  return (
    <section className={`container ${styles.builder}`} aria-label="Company builder">
      <div className={styles.toolbar}>
        <label className={styles.titleField}><span>Company name</span><input value={build.title} maxLength={64} onChange={(event) => setBuild({ ...build, title: event.target.value })} /></label>
        <label><span>Plan for</span><select value={build.mode} onChange={(event) => setBuild({ ...build, mode: event.target.value })}>{MODES.map((mode) => <option key={mode}>{mode}</option>)}</select></label>
        <div className={styles.actions}><button type="button" onClick={clearBuild}>Clear</button><button className={styles.copyButton} type="button" onClick={copyLink}>Copy page link</button><span aria-live="polite">{message}</span></div>
      </div>

      <div className={styles.workbench}>
        <section className={`${styles.gamePanel} ${styles.boardPanel}`}>
          <header className={styles.panelHeader}><strong>Board [{filledCount}]</strong><span>All 24 positions accept units</span></header>
          <div className={styles.boardStage}>
            <div className={styles.boardTopbar}>
              <div className={styles.leaderDock} onDragOver={(event) => event.preventDefault()} onDrop={handleLeaderDrop}>
                <button className={styles.leaderDockMain} type="button" onClick={() => setTab("leaders")}>
                  <span className={styles.dockLabel}>Leader</span>
                  <b>{selectedLeader?.name ?? "+ ASSIGN LEADER"}</b>
                  <small>{selectedLeader ? `${selectedLeader.trait.name} · ${selectedLeader.faction}` : "Drag a leader here or open Leaders"}</small>
                </button>
                {selectedLeader && <button className={styles.removeLeaderButton} type="button" onClick={removeLeader} aria-label={`Remove ${selectedLeader.name} as leader`} title="Remove leader">×</button>}
              </div>
              <div className={styles.boardLegend}><span><i /> Empty position</span><span><i /> Occupied card</span><strong>Drag a card to any cell</strong></div>
            </div>
            <div className={styles.formationLayout}>
              <div className={styles.rowControls} aria-label="Formation row controls">
                {Array.from({ length: BOARD_ROWS }, (_, rowIndex) => <button type="button" key={rowIndex} onClick={() => rotateFormationRow(rowIndex)} title={`Shift formation row ${rowIndex + 1} right`}><b>↻</b><small>ROW {rowIndex + 1}</small></button>)}
              </div>
              <div className={styles.boardGrid}>
                {build.slots.map((slot, index) => {
                const unit = unitBySlug.get(slot.unitSlug);
                const gearItems = equipmentFor(slot, "gear");
                const trinketItems = equipmentFor(slot, "trinkets");
                const consumables = equipmentFor(slot, "consumable");
                const usage = slot.itemSlugs.reduce((total, slug) => {
                  const item = itemBySlug.get(slug);
                  if (!item) return total;
                  const used = itemSlotUse(item);
                  return { gear: total.gear + used.gear, trinkets: total.trinkets + used.trinkets };
                }, { gear: 0, trinkets: 0 });
                const warning = unit?.verified && ((unit.gear !== undefined && usage.gear > unit.gear) || (unit.trinkets !== undefined && usage.trinkets > unit.trinkets));
                return <article
                  className={`${styles.boardSlot} ${unit ? styles.occupiedSlot : ""} ${activeSlot === index ? styles.activeSlot : ""} ${dropTarget === index ? styles.dropSlot : ""}`}
                  key={index}
                  draggable={Boolean(unit)}
                  onDragStart={(event) => unit && writeDrag(event, { kind: "slot", from: index })}
                  onMouseEnter={() => { if (unit) setHoveredSlot(index); }}
                  onDragOver={(event) => { event.preventDefault(); setDropTarget(index); }}
                  onMouseLeave={() => { setDropTarget((current) => current === index ? null : current); setHoveredSlot((current) => current === index ? null : current); }}
                  onFocusCapture={() => { if (unit) setHoveredSlot(index); }}
                  onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHoveredSlot((current) => current === index ? null : current); }}
                  onDrop={(event) => handleBoardDrop(index, event)}
                >
                  {unit && <button className={styles.removeUnitButton} type="button" draggable={false} onClick={(event) => { event.stopPropagation(); removeUnit(index); }} aria-label={`Remove ${unit.name} from ${String.fromCharCode(65 + Math.floor(index / BOARD_COLUMNS))}${index % BOARD_COLUMNS + 1}`} title="Remove unit">×</button>}
                  <button className={styles.boardSlotMain} type="button" onClick={() => handleBoardClick(index)}>
                    <span className={styles.slotNumber}>{String.fromCharCode(65 + Math.floor(index / BOARD_COLUMNS))}{index % BOARD_COLUMNS + 1}</span>
                    {unit ? <>
                      <span className={styles.miniTitle}><small>{unit.faction}</small><b>{unit.name}</b></span>
                      <UnitSprite src={unit.image} color="#e8e8e8" large />
                      {unit.stats ? <><div className={styles.miniVitals}><span>ES {unit.stats.es}</span><span>HP {unit.stats.hp}</span><span>MP {unit.stats.mp}</span></div><div className={styles.miniAttrs}><b>{unit.stats.str}</b><b>{unit.stats.agi}</b><b>{unit.stats.int}</b></div></> : <span className={styles.pendingStats}>PUBLIC STATS PENDING</span>}
                    </> : <><span className={styles.emptyCell}>+</span><b className={styles.emptyText}>{pendingPick ? "PLACE HERE" : "OPEN"}</b></>}
                  </button>
                  {unit && <div className={styles.loadoutDock}>
                    <div><label>Gear {usage.gear}/{unit.gear ?? "?"}</label><span className={styles.itemSlots}>{gearItems.map((item) => <button key={item.slug} type="button" draggable onDragStart={(event) => { event.stopPropagation(); writeDrag(event, { kind: "item", slug: item.slug, from: index }); }} onClick={() => updateSlot(index, { ...slot, itemSlugs: slot.itemSlugs.filter((slug) => slug !== item.slug) })} aria-label={`Remove ${item.name}`} title={`Drag to transfer or click × to remove ${item.name}`}><Image src={item.image} alt="" width={24} height={24} unoptimized={item.image.endsWith(".gif")} /></button>)}{Array.from({ length: Math.max(1, (unit.gear ?? 2) - gearItems.length) }, (_, emptyIndex) => <i key={emptyIndex} />)}</span></div>
                    <div><label>Trinkets {usage.trinkets}/{unit.trinkets ?? "?"}</label><span className={styles.itemSlots}>{trinketItems.map((item) => <button key={item.slug} type="button" draggable onDragStart={(event) => { event.stopPropagation(); writeDrag(event, { kind: "item", slug: item.slug, from: index }); }} onClick={() => updateSlot(index, { ...slot, itemSlugs: slot.itemSlugs.filter((slug) => slug !== item.slug) })} aria-label={`Remove ${item.name}`} title={`Drag to transfer or click × to remove ${item.name}`}><Image src={item.image} alt="" width={24} height={24} unoptimized={item.image.endsWith(".gif")} /></button>)}{Array.from({ length: Math.max(1, (unit.trinkets ?? 1) - trinketItems.length) }, (_, emptyIndex) => <i key={emptyIndex} />)}</span></div>
                    {consumables.length > 0 && <div className={styles.consumables}><label>Use</label><span className={styles.itemSlots}>{consumables.map((item) => <button key={item.slug} type="button" draggable onDragStart={(event) => { event.stopPropagation(); writeDrag(event, { kind: "item", slug: item.slug, from: index }); }} onClick={() => updateSlot(index, { ...slot, itemSlugs: slot.itemSlugs.filter((slug) => slug !== item.slug) })} aria-label={`Remove ${item.name}`} title={`Drag to transfer or click × to remove ${item.name}`}><Image src={item.image} alt="" width={24} height={24} /></button>)}</span></div>}
                    {warning && <strong className={styles.slotWarning}>SLOT LIMIT EXCEEDED</strong>}
                  </div>}
                </article>;
                })}
              </div>
              <aside className={styles.formationRail} aria-label="Formation row occupancy">
                {Array.from({ length: BOARD_ROWS }, (_, rowIndex) => {
                  const rowCount = build.slots.slice(rowIndex * BOARD_COLUMNS, (rowIndex + 1) * BOARD_COLUMNS).filter((slot) => slot.unitSlug).length;
                  return <div key={rowIndex}><span>◈</span><b>FORMATION {rowIndex + 1}</b><small>{rowCount} {rowCount === 1 ? "unit" : "units"} positioned</small></div>;
                })}
              </aside>
            </div>
            {hoveredUnit && <aside className={`${styles.gamePanel} ${styles.hoverInspect}`} aria-live="polite">
              <header className={styles.panelHeader}><strong>Inspect · {hoveredCellLabel}</strong><span>Hover detail</span></header>
              <div className={styles.inspectCard}>
                <header><small>{hoveredUnit.faction}</small><h2>{hoveredUnit.name}</h2><span>{hoveredUnit.verified ? "PUBLIC CARD · v0.301" : "ROSTER RECORD"}</span></header>
                <div className={styles.inspectStage}>
                  <div className={styles.slotPreview}><small>GEAR: {hoveredUnit.gear ?? "?"}</small><span>{Array.from({ length: hoveredUnit.gear ?? 2 }, (_, index) => <i key={index} />)}</span></div>
                  <UnitSprite src={hoveredUnit.image} color="#eeeeee" large />
                  <div className={styles.slotPreview}><small>TRINKETS: {hoveredUnit.trinkets ?? "?"}</small><span>{Array.from({ length: hoveredUnit.trinkets ?? 1 }, (_, index) => <i key={index} />)}</span></div>
                </div>
                {hoveredUnit.stats ? <>
                  <div className={styles.resources}><ResourceBar label="ES" value={hoveredUnit.stats.es} suffix="+0/s" maximum={45} /><ResourceBar label="HP" value={hoveredUnit.stats.hp} suffix={hoveredUnit.recovery} maximum={40} /><ResourceBar label="MP" value={hoveredUnit.stats.mp} suffix={hoveredUnit.manaRegen} maximum={35} /></div>
                  <div className={styles.attributes}><div><span>STR</span><b>{hoveredUnit.stats.str}</b></div><div><span>AGI</span><b>{hoveredUnit.stats.agi}</b></div><div><span>INT</span><b>{hoveredUnit.stats.int}</b></div></div>
                  <div className={styles.combatStats}><span><b>ATK</b>{hoveredUnit.stats.atk}</span><span><b>CRT</b>{hoveredUnit.stats.crt}%</span><span><b>RNG</b>{hoveredUnit.stats.rng}</span><span><b>SPD</b>{hoveredUnit.stats.spd > 0 ? "+" : ""}{hoveredUnit.stats.spd}%</span><span><b>AR</b>{hoveredUnit.stats.ar}</span><span><b>EVA</b>{hoveredUnit.stats.eva}%</span></div>
                  <section className={styles.inspectText}><h3>Trait</h3><p><strong>{hoveredUnit.trait}</strong> — {hoveredUnit.traitEffect}</p><h3>Skills</h3>{hoveredUnit.skills?.map((skill) => <p key={skill.name}><strong>{skill.name}</strong> — {skill.effect}</p>)}<h3>Tactics</h3><p><strong>{hoveredUnit.tactic}</strong> — {hoveredUnit.tacticEffect}</p></section>
                  {hoveredUnit.quote && <blockquote>“{hoveredUnit.quote}”</blockquote>}
                </> : <div className={styles.pendingPanel}><strong>PUBLIC STATS PENDING</strong><p>The official roster confirms this name and artwork, but a complete public card is not available in the verified source layer.</p></div>}
              </div>
            </aside>}
          </div>
          <footer className={styles.boardFooter}><span>{build.mode}</span><span>{filledCount}/24 positions occupied</span><span>{itemCost}G known item cost</span></footer>
        </section>

        <section className={`${styles.gamePanel} ${styles.shopPanel}`}>
          <header className={styles.panelHeader}><strong>Archive [{tab === "units" ? filteredUnits.length : tab === "items" ? filteredItems.length : filteredLeaders.length}]</strong><span>Drag a card to the board · scroll for more</span></header>
          <div className={styles.tabs} role="tablist" aria-label="Builder archive">{(["units", "items", "leaders"] as CatalogTab[]).map((catalogTab) => <button role="tab" aria-selected={tab === catalogTab} className={tab === catalogTab ? styles.selected : ""} type="button" key={catalogTab} onClick={() => { setTab(catalogTab); setQuery(""); setPendingPick(null); }}>{catalogTab}</button>)}</div>
          <div className={styles.filters}><input aria-label="Search archive" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${tab}…`} />{tab !== "items" && <select aria-label="Filter by faction" value={faction} onChange={(event) => setFaction(event.target.value)}><option value="all">All factions</option><option value="goodly-folk">Goodly Folk</option><option value="bone-host">Bone Host</option><option value="belowborn">Belowborn</option></select>}</div>
          <div className={styles.archiveList} role="tabpanel">
            {tab === "units" && filteredUnits.map((unit, index) => <button
              className={`${styles.archiveUnit} ${pendingPick?.kind === "unit" && pendingPick.slug === unit.slug ? styles.picked : ""}`}
              type="button" key={unit.slug} draggable
              onDragStart={(event) => writeDrag(event, { kind: "unit", slug: unit.slug })}
              onClick={() => { setPendingPick({ kind: "unit", slug: unit.slug }); setMessage(`${unit.name} picked up · tap a board cell`); }}
            >
              <span className={styles.archiveIndex}>{index + 1}</span>
              <UnitSprite src={unit.image} color="#e6e6e6" />
              <span className={styles.archiveIdentity}><small>{unit.faction}</small><strong>{unit.name}</strong><em>{unit.verified ? `${unit.trait} · ${unit.tactic}` : "Roster name verified · public stats pending"}</em></span>
              {unit.stats ? <span className={styles.archiveStats}><i>HP {unit.stats.hp}</i><i>STR {unit.stats.str}</i><i>AGI {unit.stats.agi}</i><i>INT {unit.stats.int}</i></span> : <span className={styles.unverifiedTag}>NAME ONLY</span>}
            </button>)}
            {tab === "items" && filteredItems.map((item, index) => <button
              className={`${styles.archiveItem} ${pendingPick?.kind === "item" && pendingPick.slug === item.slug ? styles.picked : ""}`}
              type="button" key={item.slug} draggable
              onDragStart={(event) => writeDrag(event, { kind: "item", slug: item.slug })}
              onClick={() => { setPendingPick({ kind: "item", slug: item.slug }); setMessage(`${item.name} picked up · tap a unit card`); }}
            >
              <span className={styles.archiveIndex}>{index + 1}</span><Image src={item.image} alt="" width={48} height={48} unoptimized={item.image.endsWith(".gif")} /><span className={styles.archiveIdentity}><small>{item.type}</small><strong>{item.name}</strong><em>{item.effects.slice(0, 2).join(" · ")}</em></span><b>{item.cost}G</b>
            </button>)}
            {tab === "leaders" && filteredLeaders.map((leader, index) => <button
              className={`${styles.archiveLeader} ${build.leaderSlug === leader.slug ? styles.picked : ""}`}
              type="button" key={leader.slug} draggable
              onDragStart={(event) => writeDrag(event, { kind: "leader", slug: leader.slug })}
              onClick={() => { setBuild({ ...build, leaderSlug: build.leaderSlug === leader.slug ? "" : leader.slug }); setMessage(build.leaderSlug === leader.slug ? "Leader removed" : `${leader.name} assigned`); }}
            >
              <span className={styles.archiveIndex}>{index + 1}</span><span className={styles.leaderGlyph}>{leader.name.slice(0, 1)}</span><span className={styles.archiveIdentity}><small>{leader.faction}</small><strong>{leader.name}</strong><em>{leader.trait.name} · {leader.trait.effect}</em></span>
            </button>)}
          </div>
        </section>

      </div>

      <div className={styles.notesPanel}><label><span>Player notes</span><textarea value={build.notes} maxLength={280} onChange={(event) => setBuild({ ...build, notes: event.target.value })} placeholder="Record positioning, shopping priorities, trait assumptions, or questions for other players…" /></label><aside><strong>Builder controls</strong><p>Hover, focus, or tap a placed unit to inspect its detailed card. Drag units into any Board cell, drag equipment onto a unit, and drag occupied cells to swap them. Use × to remove a unit, leader, or equipped item. Use the arrow beside a row to shift all six positions right.</p><p>Verified cards use official public v0.301 examples. The Builder does not claim availability, legality, or strength.</p></aside></div>
    </section>
  );
}
