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
type BuilderState = { title: string; mode: string; size: number; leaderSlug: string; slots: BuilderSlot[]; notes: string };
type CatalogTab = "units" | "items" | "leaders";
type DragPayload = { kind: "unit" | "item" | "leader" | "slot"; slug?: string; from?: number };
type EquipmentKind = "gear" | "trinkets" | "consumable";

const STORAGE_KEY = "goodly-trials-company-builder-v1";
const DRAG_TYPE = "application/x-goodly-builder";
const MODES = ["Theorycraft", "Single-player", "Ranked", "Multiplayer"];
const SIZES = [3, 4, 5, 6];

function emptySlots(): BuilderSlot[] {
  return Array.from({ length: 6 }, () => ({ unitSlug: "", itemSlugs: [] }));
}

function emptyBuild(): BuilderState {
  return { title: "Untitled Company", mode: "Theorycraft", size: 4, leaderSlug: "", slots: emptySlots(), notes: "" };
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
    const size = SIZES.includes(Number(parsed.size)) ? Number(parsed.size) : 4;
    const slots = Array.isArray(parsed.slots) ? parsed.slots.slice(0, 6).map((slot) => ({
      unitSlug: typeof slot?.unitSlug === "string" ? slot.unitSlug : "",
      itemSlugs: Array.isArray(slot?.itemSlugs) ? slot.itemSlugs.filter((slug): slug is string => typeof slug === "string").slice(0, 8) : [],
    })) : [];
    return {
      title: typeof parsed.title === "string" ? parsed.title.slice(0, 64) : "Untitled Company",
      mode: MODES.includes(parsed.mode ?? "") ? parsed.mode as string : "Theorycraft",
      size,
      leaderSlug: typeof parsed.leaderSlug === "string" ? parsed.leaderSlug : "",
      slots: [...slots, ...emptySlots()].slice(0, 6),
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
  const value = JSON.stringify(payload);
  event.dataTransfer.effectAllowed = payload.kind === "slot" || payload.from !== undefined ? "move" : "copy";
  event.dataTransfer.setData(DRAG_TYPE, value);
  event.dataTransfer.setData("text/plain", value);
}

function readDrag(event: DragEvent): DragPayload | null {
  try {
    return JSON.parse(event.dataTransfer.getData(DRAG_TYPE) || event.dataTransfer.getData("text/plain")) as DragPayload;
  } catch {
    return null;
  }
}

export default function BuilderClient({ roster, leaders, items }: { roster: BuilderRosterUnit[]; leaders: BuilderLeader[]; items: Item[] }) {
  const [build, setBuild] = useState<BuilderState>(emptyBuild);
  const [ready, setReady] = useState(false);
  const [activeSlot, setActiveSlot] = useState(0);
  const [tab, setTab] = useState<CatalogTab>("units");
  const [query, setQuery] = useState("");
  const [faction, setFaction] = useState("all");
  const [message, setMessage] = useState("Start by adding a unit from the library");
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  const unitBySlug = useMemo(() => new Map(roster.map((unit) => [unit.slug, unit])), [roster]);
  const itemBySlug = useMemo(() => new Map(items.map((item) => [item.slug, item])), [items]);
  const leaderBySlug = useMemo(() => new Map(leaders.map((leader) => [leader.slug, leader])), [leaders]);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const hashValue = window.location.hash.startsWith("#b=") ? window.location.hash.slice(3) : "";
      const shared = hashValue ? decodeBuild(hashValue) : null;
      const saved = !shared ? decodeBuild(window.localStorage.getItem(STORAGE_KEY) ?? "") : null;
      const next = shared ?? saved ?? emptyBuild();
      setBuild(next);
      const firstFilled = next.slots.slice(0, next.size).findIndex((slot) => slot.unitSlug);
      setActiveSlot(firstFilled >= 0 ? firstFilled : 0);
      setReady(true);
      setMessage(shared ? "Shared company loaded" : saved ? "Local company restored" : "Start by adding a unit from the library");
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const encoded = encodeBuild(build);
    window.localStorage.setItem(STORAGE_KEY, encoded);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#b=${encoded}`);
  }, [build, ready]);

  const selectedLeader = leaderBySlug.get(build.leaderSlug);
  const selectedSlots = build.slots.slice(0, build.size);
  const activeRecord = build.slots[activeSlot];
  const activeUnit = unitBySlug.get(activeRecord?.unitSlug ?? "");
  const activeItems = activeRecord?.itemSlugs.map((slug) => itemBySlug.get(slug)).filter((item): item is Item => item !== undefined) ?? [];
  const activeUsage = activeItems.reduce((total, item) => {
    const used = itemSlotUse(item);
    return { gear: total.gear + used.gear, trinkets: total.trinkets + used.trinkets };
  }, { gear: 0, trinkets: 0 });
  const itemCost = selectedSlots.reduce((total, slot) => total + slot.itemSlugs.reduce((sum, slug) => sum + (itemBySlug.get(slug)?.cost ?? 0), 0), 0);
  const queryText = query.trim().toLowerCase();
  const filteredUnits = roster.filter((unit) => (faction === "all" || unit.factionSlug === faction) && (!queryText || `${unit.name} ${unit.faction} ${unit.trait ?? ""}`.toLowerCase().includes(queryText)));
  const filteredItems = items.filter((item) => !queryText || `${item.name} ${item.type} ${item.effects.join(" ")}`.toLowerCase().includes(queryText));
  const filteredLeaders = leaders.filter((leader) => (faction === "all" || leader.factionSlug === faction) && (!queryText || `${leader.name} ${leader.epithet} ${leader.faction} ${leader.trait.name}`.toLowerCase().includes(queryText)));
  const filledCount = selectedSlots.filter((slot) => slot.unitSlug).length;

  function updateSlot(index: number, next: BuilderSlot) {
    setBuild((current) => ({ ...current, slots: current.slots.map((slot, slotIndex) => slotIndex === index ? next : slot) }));
  }

  function placeUnit(index: number, slug: string) {
    if (index >= build.size) return;
    updateSlot(index, { unitSlug: slug, itemSlugs: [] });
    setActiveSlot(index);
    setMessage(`${unitBySlug.get(slug)?.name ?? "Unit"} added to slot ${index + 1}`);
  }

  function addUnit(slug: string) {
    const firstEmpty = build.slots.slice(0, build.size).findIndex((slot) => !slot.unitSlug);
    if (firstEmpty < 0) {
      setMessage("The active board is full · remove a unit or increase the slot count");
      return;
    }
    placeUnit(firstEmpty, slug);
  }

  function equipItem(index: number, slug: string, from?: number) {
    if (!build.slots[index]?.unitSlug) {
      setMessage("Select a filled board slot before equipping an item");
      return;
    }
    setBuild((current) => {
      const slots = current.slots.map((slot) => ({ ...slot, itemSlugs: [...slot.itemSlugs] }));
      if (from !== undefined && from !== index) slots[from].itemSlugs = slots[from].itemSlugs.filter((itemSlug) => itemSlug !== slug);
      if (!slots[index].itemSlugs.includes(slug)) slots[index].itemSlugs = [...slots[index].itemSlugs, slug].slice(0, 8);
      return { ...current, slots };
    });
    setActiveSlot(index);
    setMessage(`${itemBySlug.get(slug)?.name ?? "Item"} equipped on ${unitBySlug.get(build.slots[index].unitSlug)?.name ?? `slot ${index + 1}`}`);
  }

  function moveBoardSlot(from: number, to: number) {
    if (from === to || to >= build.size) return;
    setBuild((current) => {
      const slots = [...current.slots];
      [slots[from], slots[to]] = [slots[to], slots[from]];
      return { ...current, slots };
    });
    setActiveSlot(to);
    setMessage(`Slots ${from + 1} and ${to + 1} swapped`);
  }

  function handleBoardDrop(index: number, event: DragEvent) {
    event.preventDefault();
    setDropTarget(null);
    if (index >= build.size) return;
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
    setMessage(`${leaderBySlug.get(payload.slug)?.name ?? "Leader"} selected`);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Share link copied");
    } catch {
      setMessage("Copy was blocked · copy the page URL from your browser");
    }
  }

  function clearBuild() {
    setBuild(emptyBuild());
    setActiveSlot(0);
    setTab("units");
    setMessage("Company cleared · add a unit from the library");
  }

  function equipmentFor(kind: EquipmentKind) {
    return activeItems.filter((item) => itemKind(item) === kind);
  }

  const activeWarning = activeUnit?.verified && ((activeUnit.gear !== undefined && activeUsage.gear > activeUnit.gear) || (activeUnit.trinkets !== undefined && activeUsage.trinkets > activeUnit.trinkets));

  return (
    <section className={`container ${styles.builder}`} aria-label="Company builder">
      <div className={styles.controlBar}>
        <label className={styles.titleField}><span>Company name</span><input value={build.title} maxLength={64} onChange={(event) => setBuild({ ...build, title: event.target.value })} /></label>
        <label><span>Mode</span><select value={build.mode} onChange={(event) => setBuild({ ...build, mode: event.target.value })}>{MODES.map((mode) => <option key={mode}>{mode}</option>)}</select></label>
        <fieldset className={styles.sizePicker}><legend>Slots</legend><div>{SIZES.map((size) => <button className={build.size === size ? styles.selected : ""} type="button" key={size} onClick={() => { setBuild({ ...build, size }); setActiveSlot((slot) => Math.min(slot, size - 1)); }}>{size}</button>)}</div></fieldset>
        <div className={styles.actions}><button type="button" onClick={clearBuild}>Clear</button><button className={styles.shareButton} type="button" onClick={copyLink}>Copy share link</button></div>
      </div>

      <div className={styles.statusLine}><span aria-live="polite">{message}</span><b>{filledCount}/{build.size} units · {itemCost}G known item cost</b></div>

      <ol className={styles.steps} aria-label="Builder steps">
        <li className={filledCount === 0 ? styles.currentStep : styles.doneStep}><b>1</b><span><strong>Add units</strong><small>Use the library or drag a card</small></span></li>
        <li className={filledCount > 0 && !activeItems.length ? styles.currentStep : activeItems.length ? styles.doneStep : ""}><b>2</b><span><strong>Select a unit</strong><small>Click a board card to configure it</small></span></li>
        <li className={activeItems.length ? styles.currentStep : ""}><b>3</b><span><strong>Equip items</strong><small>Use Equip or drag an item</small></span></li>
        <li><b>4</b><span><strong>Share the plan</strong><small>Copy a link when ready</small></span></li>
      </ol>

      <div className={styles.workspace}>
        <section className={styles.boardPanel}>
          <header className={styles.sectionHeader}><div><p>Formation board</p><h2>Build your company</h2></div><span>Click to select · drag filled cards to rearrange</span></header>
          <button className={styles.leaderChoice} type="button" onClick={() => { setTab("leaders"); setMessage("Choose a leader from the library below"); }} onDragOver={(event) => event.preventDefault()} onDrop={handleLeaderDrop}>
            <span>{selectedLeader ? selectedLeader.name.slice(0, 1) : "+"}</span><div><small>Company leader</small><strong>{selectedLeader?.name ?? "Choose a leader"}</strong><p>{selectedLeader ? `${selectedLeader.trait.name} · ${selectedLeader.faction}` : "Optional · select from the Leaders tab"}</p></div><b>Change ↓</b>
          </button>
          <div className={styles.boardGrid}>
            {build.slots.map((slot, index) => {
              const locked = index >= build.size;
              const unit = unitBySlug.get(slot.unitSlug);
              const equipped = slot.itemSlugs.map((slug) => itemBySlug.get(slug)).filter((item): item is Item => item !== undefined);
              return <article
                className={`${styles.boardSlot} ${locked ? styles.lockedSlot : ""} ${activeSlot === index && !locked ? styles.activeSlot : ""} ${dropTarget === index ? styles.dropSlot : ""}`}
                key={index}
                draggable={Boolean(unit) && !locked}
                onDragStart={(event) => unit && writeDrag(event, { kind: "slot", from: index })}
                onDragOver={(event) => { if (!locked) { event.preventDefault(); setDropTarget(index); } }}
                onDragLeave={() => setDropTarget((current) => current === index ? null : current)}
                onDrop={(event) => handleBoardDrop(index, event)}
              >
                <button className={styles.slotSelect} type="button" disabled={locked} onClick={() => { setActiveSlot(index); setMessage(unit ? `${unit.name} selected` : `Slot ${index + 1} selected · add a unit from the library`); }}>
                  <span className={styles.slotNumber}>Slot {index + 1}</span>
                  {locked ? <span className={styles.lockedText}>Inactive</span> : unit ? <>
                    <UnitSprite src={unit.image} color={unit.accent} large />
                    <span className={styles.slotCopy}><small>{unit.faction}</small><strong>{unit.name}</strong><em>{unit.verified ? `${unit.trait} · ${unit.tactic}` : "Roster name only"}</em></span>
                    {unit.stats && <span className={styles.slotStats}><i>HP {unit.stats.hp}</i><i>STR {unit.stats.str}</i><i>AGI {unit.stats.agi}</i><i>INT {unit.stats.int}</i></span>}
                  </> : <><span className={styles.addMark}>+</span><strong className={styles.emptyTitle}>Empty slot</strong><small className={styles.emptyHelp}>Drop a unit here or use Add to board</small></>}
                </button>
                {unit && <footer className={styles.slotFooter}><span>{equipped.length ? equipped.slice(0, 4).map((item) => <Image key={item.slug} src={item.image} alt="" width={26} height={26} unoptimized={item.image.endsWith(".gif")} />) : <small>No items</small>}</span><button type="button" onClick={() => updateSlot(index, { unitSlug: "", itemSlugs: [] })}>Remove</button></footer>}
              </article>;
            })}
          </div>
          <p className={styles.boardNote}>Slots represent a shareable planning order. The Builder does not claim that every arrangement or duplicated record is legal in every mode.</p>
        </section>

        <aside className={`${styles.loadoutPanel} ${activeUnit ? "" : styles.emptyLoadout}`} onDragOver={(event) => activeUnit && event.preventDefault()} onDrop={(event) => activeUnit && handleBoardDrop(activeSlot, event)}>
          <header className={styles.sectionHeader}><div><p>Selected unit</p><h2>{activeUnit?.name ?? "Choose a board card"}</h2></div>{activeUnit && <span>Slot {activeSlot + 1}</span>}</header>
          {activeUnit ? <>
            <div className={styles.unitSummary}><UnitSprite src={activeUnit.image} color={activeUnit.accent} large /><div><small>{activeUnit.faction}</small><strong>{activeUnit.name}</strong><p>{activeUnit.verified ? "Verified public card · v0.301" : "Roster name verified · full card pending"}</p></div></div>
            {activeUnit.stats && <><div className={styles.coreStats}><span><b>HP</b>{activeUnit.stats.hp}</span><span><b>STR</b>{activeUnit.stats.str}</span><span><b>AGI</b>{activeUnit.stats.agi}</span><span><b>INT</b>{activeUnit.stats.int}</span></div><div className={styles.combatStats}><span>ATK <b>{activeUnit.stats.atk}</b></span><span>AR <b>{activeUnit.stats.ar}</b></span><span>EVA <b>{activeUnit.stats.eva}%</b></span><span>RNG <b>{activeUnit.stats.rng}</b></span></div></>}
            <div className={styles.equipmentBlock}>
              <header><div><p>Equipment</p><strong>Drag items here or use Equip</strong></div>{activeWarning && <span>Review slot limit</span>}</header>
              {(["gear", "trinkets", "consumable"] as EquipmentKind[]).map((kind) => {
                const equipped = equipmentFor(kind);
                const label = kind === "gear" ? `Gear ${activeUsage.gear}/${activeUnit.gear ?? "?"}` : kind === "trinkets" ? `Trinkets ${activeUsage.trinkets}/${activeUnit.trinkets ?? "?"}` : "Consumables";
                return <div className={styles.equipmentRow} key={kind}><label>{label}</label><span>{equipped.map((item) => <button key={item.slug} type="button" draggable onDragStart={(event) => writeDrag(event, { kind: "item", slug: item.slug, from: activeSlot })} onClick={() => updateSlot(activeSlot, { ...activeRecord, itemSlugs: activeRecord.itemSlugs.filter((slug) => slug !== item.slug) })} title={`Remove ${item.name}`}><Image src={item.image} alt="" width={36} height={36} unoptimized={item.image.endsWith(".gif")} /><small>{item.name}</small></button>)}{!equipped.length && <i>Empty</i>}</span></div>;
              })}
            </div>
            {activeUnit.verified && <div className={styles.verifiedDetails}><p><strong>{activeUnit.trait}</strong>{activeUnit.traitEffect}</p>{activeUnit.skills?.slice(0, 1).map((skill) => <p key={skill.name}><strong>{skill.name}</strong>{skill.effect}</p>)}<p><strong>{activeUnit.tactic}</strong>{activeUnit.tacticEffect}</p></div>}
            <a className={styles.libraryJump} href="#builder-library">Choose equipment from the library ↓</a>
          </> : <div className={styles.emptyState}><span>1</span><h3>Select a unit on the board</h3><p>Its verified stats and equipment slots will appear here. Empty slots can be filled from the library below.</p><a href="#builder-library">Open unit library ↓</a></div>}
        </aside>
      </div>

      <section className={styles.libraryPanel} id="builder-library">
        <header className={styles.libraryHeader}><div><p>Builder library</p><h2>Choose what to add</h2><span>Buttons are the primary controls. Dragging is an optional shortcut.</span></div><div className={styles.tabs} role="tablist" aria-label="Builder library">{(["units", "items", "leaders"] as CatalogTab[]).map((catalogTab) => <button role="tab" aria-selected={tab === catalogTab} className={tab === catalogTab ? styles.selected : ""} type="button" key={catalogTab} onClick={() => { setTab(catalogTab); setQuery(""); }}>{catalogTab}</button>)}</div></header>
        <div className={styles.filters}><input aria-label="Search library" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${tab}…`} />{tab !== "items" && <select aria-label="Filter by faction" value={faction} onChange={(event) => setFaction(event.target.value)}><option value="all">All factions</option><option value="goodly-folk">Goodly Folk</option><option value="bone-host">Bone Host</option><option value="belowborn">Belowborn</option></select>}<span>{tab === "items" && !activeUnit ? "Select a board unit before equipping" : `${tab === "units" ? filteredUnits.length : tab === "items" ? filteredItems.length : filteredLeaders.length} records`}</span></div>
        <div className={styles.libraryGrid} role="tabpanel">
          {tab === "units" && filteredUnits.map((unit) => <article className={styles.unitCard} key={unit.slug} draggable onDragStart={(event) => writeDrag(event, { kind: "unit", slug: unit.slug })}>
            <div className={styles.cardVisual}><UnitSprite src={unit.image} color={unit.accent} large /><span>{unit.verified ? "Verified card" : "Name only"}</span></div><div className={styles.cardContent}><small>{unit.faction}</small><h3>{unit.name}</h3><p>{unit.verified ? `${unit.trait} · ${unit.tactic}` : "Confirmed roster name; public stats pending."}</p>{unit.stats && <div className={styles.cardStats}><span>HP {unit.stats.hp}</span><span>STR {unit.stats.str}</span><span>AGI {unit.stats.agi}</span><span>INT {unit.stats.int}</span></div>}<button type="button" onClick={() => addUnit(unit.slug)}>+ Add to board</button></div>
          </article>)}
          {tab === "items" && filteredItems.map((item) => <article className={styles.itemCard} key={item.slug} draggable onDragStart={(event) => writeDrag(event, { kind: "item", slug: item.slug })}>
            <div className={styles.itemVisual}><Image src={item.image} alt="" width={66} height={66} unoptimized={item.image.endsWith(".gif")} /><span>{item.cost}G</span></div><div className={styles.cardContent}><small>{item.type}</small><h3>{item.name}</h3><p>{item.effects.slice(0, 2).join(" · ")}</p><button type="button" disabled={!activeUnit} onClick={() => equipItem(activeSlot, item.slug)}>Equip {activeUnit ? activeUnit.name : "selected unit"}</button></div>
          </article>)}
          {tab === "leaders" && filteredLeaders.map((leader) => <article className={styles.leaderCard} key={leader.slug} draggable onDragStart={(event) => writeDrag(event, { kind: "leader", slug: leader.slug })}>
            <span className={styles.leaderMark}>{leader.name.slice(0, 1)}</span><div className={styles.cardContent}><small>{leader.faction}</small><h3>{leader.name}</h3><p><strong>{leader.trait.name}</strong> · {leader.trait.effect}</p><button type="button" onClick={() => { setBuild({ ...build, leaderSlug: build.leaderSlug === leader.slug ? "" : leader.slug }); setMessage(build.leaderSlug === leader.slug ? "Leader removed" : `${leader.name} selected`); }}>{build.leaderSlug === leader.slug ? "Remove leader" : "Select leader"}</button></div>
          </article>)}
        </div>
      </section>

      <div className={styles.notesPanel}><label><span>Player notes</span><textarea value={build.notes} maxLength={280} onChange={(event) => setBuild({ ...build, notes: event.target.value })} placeholder="Record positioning, shopping priorities, trait assumptions, or questions for other players…" /></label><aside><strong>Evidence boundary</strong><p>Verified cards use official public v0.301 examples. “Name only” records have confirmed names and artwork but no complete public stats here. The Builder does not claim availability, legality, or strength.</p></aside></div>
    </section>
  );
}
