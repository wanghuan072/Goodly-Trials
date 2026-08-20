"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
  tactic?: string;
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
type BuilderState = {
  title: string;
  mode: string;
  size: number;
  leaderSlug: string;
  slots: BuilderSlot[];
  notes: string;
};
type CatalogTab = "units" | "items" | "leaders";

const STORAGE_KEY = "goodly-trials-company-builder-v1";
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
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Partial<BuilderState>;
    const size = SIZES.includes(Number(parsed.size)) ? Number(parsed.size) : 4;
    const slots = Array.isArray(parsed.slots)
      ? parsed.slots.slice(0, 6).map((slot) => ({
        unitSlug: typeof slot?.unitSlug === "string" ? slot.unitSlug : "",
        itemSlugs: Array.isArray(slot?.itemSlugs) ? slot.itemSlugs.filter((slug): slug is string => typeof slug === "string").slice(0, 8) : [],
      }))
      : [];
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

export default function BuilderClient({ roster, leaders, items }: { roster: BuilderRosterUnit[]; leaders: BuilderLeader[]; items: Item[] }) {
  const [build, setBuild] = useState<BuilderState>(emptyBuild);
  const [ready, setReady] = useState(false);
  const [activeSlot, setActiveSlot] = useState(0);
  const [tab, setTab] = useState<CatalogTab>("units");
  const [query, setQuery] = useState("");
  const [faction, setFaction] = useState("all");
  const [message, setMessage] = useState("Saved on this device");

  const unitBySlug = useMemo(() => new Map(roster.map((unit) => [unit.slug, unit])), [roster]);
  const itemBySlug = useMemo(() => new Map(items.map((item) => [item.slug, item])), [items]);
  const leaderBySlug = useMemo(() => new Map(leaders.map((leader) => [leader.slug, leader])), [leaders]);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const hashValue = window.location.hash.startsWith("#b=") ? window.location.hash.slice(3) : "";
      const shared = hashValue ? decodeBuild(hashValue) : null;
      const saved = !shared ? decodeBuild(window.localStorage.getItem(STORAGE_KEY) ?? "") : null;
      setBuild(shared ?? saved ?? emptyBuild());
      setReady(true);
      setMessage(shared ? "Shared company loaded" : saved ? "Local company restored" : "Saved on this device");
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
  const activeUnit = unitBySlug.get(build.slots[activeSlot]?.unitSlug ?? "");
  const selectedSlots = build.slots.slice(0, build.size);
  const itemCost = selectedSlots.reduce((total, slot) => total + slot.itemSlugs.reduce((sum, slug) => sum + (itemBySlug.get(slug)?.cost ?? 0), 0), 0);
  const factionCounts = selectedSlots.reduce<Record<string, number>>((counts, slot) => {
    const unit = unitBySlug.get(slot.unitSlug);
    if (unit) counts[unit.faction] = (counts[unit.faction] ?? 0) + 1;
    return counts;
  }, {});
  const queryText = query.trim().toLowerCase();
  const filteredUnits = roster.filter((unit) =>
    (faction === "all" || unit.factionSlug === faction)
    && (!queryText || `${unit.name} ${unit.faction} ${unit.trait ?? ""} ${unit.tactic ?? ""}`.toLowerCase().includes(queryText)),
  );
  const filteredItems = items.filter((item) => !queryText || `${item.name} ${item.type} ${item.effects.join(" ")}`.toLowerCase().includes(queryText));
  const filteredLeaders = leaders.filter((leader) =>
    (faction === "all" || leader.factionSlug === faction)
    && (!queryText || `${leader.name} ${leader.epithet} ${leader.faction} ${leader.trait.name}`.toLowerCase().includes(queryText)),
  );

  function updateSlot(index: number, next: BuilderSlot) {
    setBuild((current) => ({ ...current, slots: current.slots.map((slot, slotIndex) => slotIndex === index ? next : slot) }));
  }

  function addUnit(slug: string) {
    const currentIsEmpty = !build.slots[activeSlot]?.unitSlug && activeSlot < build.size;
    const firstEmpty = build.slots.slice(0, build.size).findIndex((slot) => !slot.unitSlug);
    const target = currentIsEmpty ? activeSlot : firstEmpty >= 0 ? firstEmpty : activeSlot;
    updateSlot(target, { unitSlug: slug, itemSlugs: [] });
    setActiveSlot(target);
    setTab("items");
    setMessage("Unit added · choose items or another slot");
  }

  function toggleItem(slug: string) {
    const slot = build.slots[activeSlot];
    if (!slot?.unitSlug) {
      setMessage("Select a formation slot with a unit first");
      return;
    }
    const hasItem = slot.itemSlugs.includes(slug);
    updateSlot(activeSlot, { ...slot, itemSlugs: hasItem ? slot.itemSlugs.filter((itemSlug) => itemSlug !== slug) : [...slot.itemSlugs, slug].slice(0, 8) });
    setMessage(hasItem ? "Item removed" : "Item attached · legality is shown as a warning");
  }

  function moveSlot(from: number, direction: -1 | 1) {
    const to = from + direction;
    if (to < 0 || to >= build.size) return;
    setBuild((current) => {
      const slots = [...current.slots];
      [slots[from], slots[to]] = [slots[to], slots[from]];
      return { ...current, slots };
    });
    setActiveSlot(to);
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
    setMessage("Company cleared");
  }

  return (
    <section className={`container ${styles.builder}`} aria-label="Company builder">
      <div className={styles.toolbar}>
        <label className={styles.titleField}>
          <span>Company name</span>
          <input value={build.title} maxLength={64} onChange={(event) => setBuild({ ...build, title: event.target.value })} />
        </label>
        <label>
          <span>Plan for</span>
          <select value={build.mode} onChange={(event) => setBuild({ ...build, mode: event.target.value })}>
            {MODES.map((mode) => <option key={mode}>{mode}</option>)}
          </select>
        </label>
        <fieldset className={styles.sizePicker}>
          <legend>Company size</legend>
          <div>{SIZES.map((size) => <button className={build.size === size ? styles.selected : ""} type="button" key={size} onClick={() => { setBuild({ ...build, size }); setActiveSlot((slot) => Math.min(slot, size - 1)); }}>{size}</button>)}</div>
        </fieldset>
        <div className={styles.actions}>
          <button type="button" onClick={clearBuild}>Clear</button>
          <button className={styles.copyButton} type="button" onClick={copyLink}>Copy build link</button>
          <span aria-live="polite">{message}</span>
        </div>
      </div>

      <div className={styles.summaryBar}>
        <div><span>Leader</span><strong>{selectedLeader?.name ?? "Not chosen"}</strong></div>
        <div><span>Units</span><strong>{selectedSlots.filter((slot) => slot.unitSlug).length}/{build.size}</strong></div>
        <div><span>Known item cost</span><strong>{itemCost}G</strong></div>
        <div className={styles.factionSummary}><span>Company mix</span><strong>{Object.entries(factionCounts).map(([name, count]) => `${name} ×${count}`).join(" · ") || "Empty"}</strong></div>
      </div>

      <div className={styles.leaderStrip}>
        <button className={styles.leaderCard} type="button" onClick={() => setTab("leaders")}>
          <span className={styles.leaderMark}>{selectedLeader ? selectedLeader.name.slice(0, 1) : "+"}</span>
          <span><small>Company leader</small><strong>{selectedLeader?.name ?? "Choose a leader"}</strong><em>{selectedLeader ? `${selectedLeader.trait.name} · ${selectedLeader.faction}` : "Optional for theorycrafting"}</em></span>
        </button>
        <p>Formation order runs left to right. Use the arrows on each card to test adjacency and backline ideas.</p>
      </div>

      <div className={styles.formation} style={{ "--company-size": build.size } as React.CSSProperties}>
        {selectedSlots.map((slot, index) => {
          const unit = unitBySlug.get(slot.unitSlug);
          const selectedItems = slot.itemSlugs.map((slug) => itemBySlug.get(slug)).filter((item): item is Item => Boolean(item));
          const usage = selectedItems.reduce((total, item) => {
            const used = itemSlotUse(item);
            return { gear: total.gear + used.gear, trinkets: total.trinkets + used.trinkets };
          }, { gear: 0, trinkets: 0 });
          const capacityWarning = unit?.verified && ((unit.gear !== undefined && usage.gear > unit.gear) || (unit.trinkets !== undefined && usage.trinkets > unit.trinkets));
          return (
            <article className={`${styles.slot} ${activeSlot === index ? styles.activeSlot : ""}`} key={index}>
              <button className={styles.slotMain} type="button" onClick={() => { setActiveSlot(index); setTab(unit ? "items" : "units"); }} aria-label={unit ? `Edit slot ${index + 1}, ${unit.name}` : `Choose unit for slot ${index + 1}`}>
                <span className={styles.slotNumber}>{index + 1}</span>
                {unit ? <UnitSprite src={unit.image} color={unit.accent} large /> : <span className={styles.emptyMark}>+</span>}
                <span className={styles.slotIdentity}>
                  <small>{unit?.faction ?? "Open formation slot"}</small>
                  <strong>{unit?.name ?? "Choose unit"}</strong>
                  <em>{unit ? unit.verified ? "Verified public card" : "Roster name only" : "Select from the catalog"}</em>
                </span>
              </button>
              {unit && <>
                <div className={styles.slotTools}>
                  <button type="button" disabled={index === 0} onClick={() => moveSlot(index, -1)} aria-label={`Move ${unit.name} left`}>←</button>
                  <button type="button" onClick={() => { setActiveSlot(index); setTab("items"); }}>Equip</button>
                  <button type="button" disabled={index === build.size - 1} onClick={() => moveSlot(index, 1)} aria-label={`Move ${unit.name} right`}>→</button>
                  <button type="button" onClick={() => updateSlot(index, { unitSlug: "", itemSlugs: [] })}>Remove</button>
                </div>
                <div className={styles.equipment}>
                  {selectedItems.length ? selectedItems.map((item) => <button type="button" key={item.slug} onClick={() => { setActiveSlot(index); toggleItem(item.slug); }} title={`Remove ${item.name}`}><Image src={item.image} alt="" width={28} height={28} unoptimized={item.image.endsWith(".gif")} /><span>{item.name}</span></button>) : <span>No items attached</span>}
                </div>
                {unit.verified && <p className={capacityWarning ? styles.warning : styles.capacity}>Known slots: {usage.gear}/{unit.gear ?? "?"} gear · {usage.trinkets}/{unit.trinkets ?? "?"} trinkets{capacityWarning ? " · review loadout" : ""}</p>}
              </>}
            </article>
          );
        })}
      </div>

      <div className={styles.catalog}>
        <div className={styles.catalogHeader}>
          <div className={styles.tabs} role="tablist" aria-label="Builder catalog">
            {(["units", "items", "leaders"] as CatalogTab[]).map((catalogTab) => <button role="tab" aria-selected={tab === catalogTab} className={tab === catalogTab ? styles.selected : ""} type="button" key={catalogTab} onClick={() => { setTab(catalogTab); setQuery(""); }}>{catalogTab}</button>)}
          </div>
          <label className={styles.search}><span className="sr-only">Search builder catalog</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${tab}…`} /></label>
          {tab !== "items" && <select aria-label="Filter by faction" value={faction} onChange={(event) => setFaction(event.target.value)}><option value="all">All factions</option><option value="goodly-folk">Goodly Folk</option><option value="bone-host">Bone Host</option><option value="belowborn">Belowborn</option></select>}
        </div>

        {tab === "units" && <div className={styles.catalogGrid} role="tabpanel">
          {filteredUnits.map((unit) => <button className={styles.catalogUnit} type="button" key={unit.slug} onClick={() => addUnit(unit.slug)} style={{ "--unit-accent": unit.accent } as React.CSSProperties}>
            <UnitSprite src={unit.image} color={unit.accent} />
            <span><strong>{unit.name}</strong><small>{unit.faction}</small><em>{unit.verified ? `${unit.trait} · ${unit.tactic}` : "Roster name verified · stats pending"}</em></span>
            <b>+</b>
          </button>)}
        </div>}

        {tab === "items" && <div className={styles.catalogGrid} role="tabpanel">
          {!activeUnit && <p className={styles.catalogNotice}>Choose a unit slot before attaching items. You can still browse all verified public examples below.</p>}
          {filteredItems.map((item) => {
            const selected = build.slots[activeSlot]?.itemSlugs.includes(item.slug);
            return <button className={`${styles.catalogItem} ${selected ? styles.catalogSelected : ""}`} type="button" key={item.slug} onClick={() => toggleItem(item.slug)}>
              <Image src={item.image} alt="" width={52} height={52} unoptimized={item.image.endsWith(".gif")} />
              <span><strong>{item.name}</strong><small>{item.type} · {item.cost}G</small><em>{item.effects.slice(0, 2).join(" · ")}</em></span>
              <b>{selected ? "✓" : "+"}</b>
            </button>;
          })}
        </div>}

        {tab === "leaders" && <div className={styles.catalogGrid} role="tabpanel">
          {filteredLeaders.map((leader) => <button className={`${styles.catalogLeader} ${build.leaderSlug === leader.slug ? styles.catalogSelected : ""}`} type="button" key={leader.slug} onClick={() => { setBuild({ ...build, leaderSlug: build.leaderSlug === leader.slug ? "" : leader.slug }); setMessage(build.leaderSlug === leader.slug ? "Leader removed" : `${leader.name} selected`); }}>
            <span className={styles.leaderMark}>{leader.name.slice(0, 1)}</span>
            <span><strong>{leader.name}</strong><small>{leader.epithet || leader.faction}</small><em>{leader.trait.name} · {leader.trait.effect}</em></span>
            <b>{build.leaderSlug === leader.slug ? "✓" : "+"}</b>
          </button>)}
        </div>}
      </div>

      <div className={styles.notesPanel}>
        <label><span>Player notes</span><textarea value={build.notes} maxLength={280} onChange={(event) => setBuild({ ...build, notes: event.target.value })} placeholder="Record positioning, shopping priorities, trait assumptions, or questions for other players…" /></label>
        <aside><strong>Evidence boundary</strong><p>Verified cards use official public v0.301 examples. “Roster name only” entries have confirmed names and artwork but no published stats here. The Builder does not validate availability, duplicates, mode rules, or strength.</p></aside>
      </div>
    </section>
  );
}
