"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import UnitSprite from "@/components/content/UnitSprite";
import { activeBoardCells, BOARD_CELLS, BOARD_COLUMNS, BOARD_ROWS, followerCapLabel, followerLimitForRules, MAX_TRIAL_WEEK } from "@/lib/builder/board-rules";
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
type BuilderState = { title: string; mode: string; week: number; leaderSlug: string; slots: BuilderSlot[]; notes: string };
type CatalogTab = "units" | "items" | "leaders";
type CatalogPreview = { kind: "unit" | "item" | "leader"; slug: string } | null;
type PendingPick = { kind: "unit" | "item"; slug: string } | null;
type DragPayload = { kind: "unit" | "item" | "leader" | "slot"; slug?: string; from?: number };
type EquipmentKind = "gear" | "trinkets" | "consumable";

const STORAGE_KEY = "goodly-trials-company-builder-v2";
const DRAG_TYPE = "application/x-goodly-builder";
const MODES = ["Theorycraft", "Single-player", "Ranked", "Multiplayer"];
const LEGACY_SLOT_POSITIONS = [9, 10, 14, 15, 20, 21];

function emptySlots(): BuilderSlot[] {
  return Array.from({ length: BOARD_CELLS }, () => ({ unitSlug: "", itemSlugs: [] }));
}

function emptyBuild(): BuilderState {
  return { title: "Untitled Company", mode: "Theorycraft", week: 1, leaderSlug: "", slots: emptySlots(), notes: "" };
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
      week: typeof parsed.week === "number" ? Math.min(MAX_TRIAL_WEEK, Math.max(1, Math.floor(parsed.week))) : MAX_TRIAL_WEEK,
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
  const [tab, setTab] = useState<CatalogTab>("leaders");
  const [query, setQuery] = useState("");
  const [faction, setFaction] = useState("all");
  const [message, setMessage] = useState("Choose or drag a leader to begin");
  const [pendingPick, setPendingPick] = useState<PendingPick>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [draggingPayload, setDraggingPayload] = useState<DragPayload | null>(null);
  const [catalogPreview, setCatalogPreview] = useState<CatalogPreview>(null);
  const dragPointerY = useRef<number | null>(null);
  const dragScrollFrame = useRef<number | null>(null);

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
      setTab(next.leaderSlug ? "units" : "leaders");
      if (window.location.hash || window.location.search) window.history.replaceState(null, "", window.location.pathname);
      setReady(true);
      setMessage(imported ? "Company imported and saved on this device" : saved ? "Local company restored" : "Choose or drag a leader to begin");
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const encoded = encodeBuild(build);
    window.localStorage.setItem(STORAGE_KEY, encoded);
  }, [build, ready]);

  useEffect(() => () => {
    if (dragScrollFrame.current !== null) window.cancelAnimationFrame(dragScrollFrame.current);
  }, []);

  const selectedLeader = leaderBySlug.get(build.leaderSlug);
  const selectedSlots = build.slots;
  const filledCount = selectedSlots.filter((slot) => slot.unitSlug).length;
  const availableCells = useMemo(() => activeBoardCells(build.week), [build.week]);
  const followerLimit = followerLimitForRules(build.week, build.mode, selectedLeader?.factionSlug);
  const lockedUnitCount = selectedSlots.filter((slot, index) => slot.unitSlug && !availableCells.has(index)).length;
  const wrongFactionCount = selectedLeader && build.mode !== "Multiplayer"
    ? selectedSlots.filter((slot) => {
        const unit = unitBySlug.get(slot.unitSlug);
        return unit && unit.factionSlug !== selectedLeader.factionSlug;
      }).length
    : 0;
  const rulesInvalid = !selectedLeader ? filledCount > 0 : filledCount > followerLimit || lockedUnitCount > 0 || wrongFactionCount > 0;
  const rulesSummary = followerCapLabel(build.mode, selectedLeader?.factionSlug);
  const previewUnit = catalogPreview?.kind === "unit" ? unitBySlug.get(catalogPreview.slug) : undefined;
  const previewItem = catalogPreview?.kind === "item" ? itemBySlug.get(catalogPreview.slug) : undefined;
  const previewLeader = catalogPreview?.kind === "leader" ? leaderBySlug.get(catalogPreview.slug) : undefined;
  const pendingLabel = pendingPick?.kind === "unit" ? unitBySlug.get(pendingPick.slug)?.name : pendingPick?.kind === "item" ? itemBySlug.get(pendingPick.slug)?.name : undefined;
  const itemCost = selectedSlots.reduce((total, slot) => total + slot.itemSlugs.reduce((sum, slug) => sum + (itemBySlug.get(slug)?.cost ?? 0), 0), 0);
  const queryText = query.trim().toLowerCase();
  const filteredUnits = roster.filter((unit) => (faction === "all" || unit.factionSlug === faction) && (!queryText || `${unit.name} ${unit.faction} ${unit.trait ?? ""}`.toLowerCase().includes(queryText)));
  const filteredItems = items.filter((item) => !queryText || `${item.name} ${item.type} ${item.effects.join(" ")}`.toLowerCase().includes(queryText));
  const filteredLeaders = leaders.filter((leader) => (faction === "all" || leader.factionSlug === faction) && (!queryText || `${leader.name} ${leader.epithet} ${leader.faction} ${leader.trait.name}`.toLowerCase().includes(queryText)));

  function showCatalogPreview(kind: Exclude<CatalogPreview, null>["kind"], slug: string) {
    setCatalogPreview({ kind, slug });
  }

  function clearCatalogPreview(kind: Exclude<CatalogPreview, null>["kind"], slug: string) {
    setCatalogPreview((current) => current?.kind === kind && current.slug === slug ? null : current);
  }

  function startDrag(event: DragEvent, payload: DragPayload) {
    setDraggingPayload(payload);
    setDropTarget(null);
    setPendingPick(null);
    dragPointerY.current = event.clientY;
    if (dragScrollFrame.current === null) dragScrollFrame.current = window.requestAnimationFrame(runDragAutoScroll);
    writeDrag(event, payload);
  }

  function finishDrag() {
    setDraggingPayload(null);
    setDropTarget(null);
    dragPointerY.current = null;
    if (dragScrollFrame.current !== null) {
      window.cancelAnimationFrame(dragScrollFrame.current);
      dragScrollFrame.current = null;
    }
  }

  function runDragAutoScroll() {
    const pointerY = dragPointerY.current;
    if (pointerY === null) {
      dragScrollFrame.current = null;
      return;
    }
    const viewportHeight = window.innerHeight;
    const edgeZone = Math.min(150, Math.max(90, viewportHeight * 0.18));
    let scrollAmount = 0;
    if (pointerY < edgeZone) scrollAmount = -Math.ceil(4 + (edgeZone - pointerY) / edgeZone * 18);
    if (pointerY > viewportHeight - edgeZone) scrollAmount = Math.ceil(4 + (pointerY - (viewportHeight - edgeZone)) / edgeZone * 18);
    if (scrollAmount !== 0) window.scrollBy(0, scrollAmount);
    dragScrollFrame.current = window.requestAnimationFrame(runDragAutoScroll);
  }

  function trackDragPosition(event: DragEvent<HTMLElement>) {
    dragPointerY.current = event.clientY;
    if (dragScrollFrame.current === null) dragScrollFrame.current = window.requestAnimationFrame(runDragAutoScroll);
  }

  function slotUsage(slot: BuilderSlot) {
    return slot.itemSlugs.reduce((total, itemSlug) => {
      const item = itemBySlug.get(itemSlug);
      if (!item) return total;
      const used = itemSlotUse(item);
      return { gear: total.gear + used.gear, trinkets: total.trinkets + used.trinkets };
    }, { gear: 0, trinkets: 0 });
  }

  function slotCapacity(slot: BuilderSlot, unit: BuilderRosterUnit) {
    return slot.itemSlugs.reduce((capacity, itemSlug) => {
      const item = itemBySlug.get(itemSlug);
      if (!item) return capacity;
      item.effects.forEach((effect) => {
        const match = effect.match(/^\+(\d+)\s+(gear|trinket) slot/i);
        if (!match) return;
        const amount = Number(match[1]);
        if (match[2].toLowerCase() === "gear") capacity.gear += amount;
        else capacity.trinkets += amount;
      });
      return capacity;
    }, { gear: unit.gear ?? 0, trinkets: unit.trinkets ?? 0 });
  }

  function unitArchiveBlockReason(unit: BuilderRosterUnit) {
    if (!selectedLeader) return "LEADER REQUIRED";
    if (build.mode !== "Multiplayer" && unit.factionSlug !== selectedLeader.factionSlug) return "FACTION LOCKED";
    if (filledCount >= followerLimit) return `CAP ${filledCount}/${followerLimit}`;
    return null;
  }

  function unitPlacementError(index: number, slug: string) {
    const unit = unitBySlug.get(slug);
    if (!unit) return "That unit is not available in the verified roster";
    if (index < 0 || index >= BOARD_CELLS || !availableCells.has(index)) return `That position is not available in week ${build.week}`;
    if (!selectedLeader) return "Assign a leader before placing followers";
    if (build.mode !== "Multiplayer" && unit.factionSlug !== selectedLeader.factionSlug) return `${unit.name} cannot join a ${selectedLeader.faction} company`;
    if (build.slots[index].unitSlug) return "That board cell is occupied · move or remove its unit first";
    if (filledCount >= followerLimit) return `Board is full (${filledCount}/${followerLimit} followers) · ${rulesSummary}`;
    return null;
  }

  function itemEquipError(index: number, slug: string, from?: number) {
    const item = itemBySlug.get(slug);
    const slot = build.slots[index];
    const unit = slot ? unitBySlug.get(slot.unitSlug) : undefined;
    if (!availableCells.has(index)) return `That position is not available in week ${build.week}`;
    if (!item) return "That item is not available in the verified archive";
    if (!unit) return "Place a unit in that board slot first";

    const existingIndex = build.slots.findIndex((candidate) => candidate.itemSlugs.includes(slug));
    if (item.type.includes("Unique") && existingIndex >= 0 && existingIndex !== from) return `${item.name} is unique and is already assigned`;
    if (slot.itemSlugs.includes(slug)) return `${item.name} is already assigned to ${unit.name}`;

    const required = itemSlotUse(item);
    if (required.gear === 0 && required.trinkets === 0) return null;
    if (!unit.verified || unit.gear === undefined || unit.trinkets === undefined) return `${unit.name} has no verified public equipment capacity`;

    const usage = slotUsage(slot);
    const capacity = slotCapacity(slot, unit);
    if (required.gear > 0 && usage.gear + required.gear > capacity.gear) return `${unit.name} has no open gear slot (${usage.gear}/${capacity.gear})`;
    if (required.trinkets > 0 && usage.trinkets + required.trinkets > capacity.trinkets) return `${unit.name} has no open trinket slot (${usage.trinkets}/${capacity.trinkets})`;
    return null;
  }

  function itemRemovalError(index: number, slug: string) {
    const slot = build.slots[index];
    const unit = slot ? unitBySlug.get(slot.unitSlug) : undefined;
    const item = itemBySlug.get(slug);
    if (!slot || !unit || !item || !slot.itemSlugs.includes(slug)) return null;
    const nextSlot = { ...slot, itemSlugs: slot.itemSlugs.filter((itemSlug) => itemSlug !== slug) };
    const usage = slotUsage(nextSlot);
    const capacity = slotCapacity(nextSlot, unit);
    if (usage.gear > capacity.gear || usage.trinkets > capacity.trinkets) return `Cannot remove ${item.name} · ${unit.name} still depends on the slot capacity it grants`;
    return null;
  }

  function removeItem(index: number, slug: string) {
    const error = itemRemovalError(index, slug);
    if (error) {
      setMessage(error);
      return;
    }
    const itemName = itemBySlug.get(slug)?.name ?? "Item";
    updateSlot(index, { ...build.slots[index], itemSlugs: build.slots[index].itemSlugs.filter((itemSlug) => itemSlug !== slug) });
    setMessage(`${itemName} removed from slot ${index + 1}`);
  }

  function itemArchiveBlockReason(item: Item) {
    if (filledCount === 0) return "PLACE UNIT FIRST";
    const canEquip = build.slots.some((slot, index) => slot.unitSlug && !itemEquipError(index, item.slug));
    return canEquip ? null : "NO OPEN SLOT";
  }

  function canDropOnCell(index: number, payload: DragPayload) {
    if (payload.kind === "unit" && payload.slug) return !unitPlacementError(index, payload.slug);
    if (payload.kind === "item" && payload.slug) return !itemEquipError(index, payload.slug, payload.from) && (payload.from === undefined || payload.from === index || !itemRemovalError(payload.from, payload.slug));
    if (payload.kind === "slot" && payload.from !== undefined) return payload.from !== index && availableCells.has(index);
    return false;
  }

  function updateSlot(index: number, next: BuilderSlot) {
    setBuild((current) => ({ ...current, slots: current.slots.map((slot, slotIndex) => slotIndex === index ? next : slot) }));
  }

  function placeUnit(index: number, slug: string) {
    const error = unitPlacementError(index, slug);
    if (error) {
      if (!selectedLeader) setTab("leaders");
      setMessage(error);
      return;
    }
    updateSlot(index, { unitSlug: slug, itemSlugs: [] });
    setActiveSlot(index);
    setCatalogPreview(null);
    setPendingPick(null);
    setMessage(`${unitBySlug.get(slug)?.name ?? "Unit"} placed in board slot ${index + 1}`);
  }

  function equipItem(index: number, slug: string, from?: number) {
    const error = itemEquipError(index, slug, from);
    if (error) {
      setMessage(error);
      return;
    }
    if (from !== undefined && from !== index) {
      const removalError = itemRemovalError(from, slug);
      if (removalError) {
        setMessage(removalError);
        return;
      }
    }
    setBuild((current) => {
      const slots = current.slots.map((slot) => ({ ...slot, itemSlugs: [...slot.itemSlugs] }));
      if (from !== undefined && from !== index) slots[from].itemSlugs = slots[from].itemSlugs.filter((itemSlug) => itemSlug !== slug);
      slots[index].itemSlugs = [...slots[index].itemSlugs, slug];
      return { ...current, slots };
    });
    setActiveSlot(index);
    setCatalogPreview(null);
    setPendingPick(null);
    setMessage(`${itemBySlug.get(slug)?.name ?? "Item"} equipped on slot ${index + 1}`);
  }

  function moveBoardSlot(from: number, to: number) {
    if (from === to || to < 0 || to >= BOARD_CELLS) return;
    if (!availableCells.has(to)) {
      setMessage(`That position is not available in week ${build.week}`);
      return;
    }
    setBuild((current) => {
      const slots = [...current.slots];
      [slots[from], slots[to]] = [slots[to], slots[from]];
      return { ...current, slots };
    });
    setActiveSlot(to);
    setCatalogPreview(null);
    setMessage(`Board slots ${from + 1} and ${to + 1} swapped`);
  }

  function handleBoardClick(index: number) {
    if (index < 0 || index >= BOARD_CELLS) return;
    if (!availableCells.has(index) && !build.slots[index].unitSlug) {
      setMessage(`That position unlocks later · current plan is week ${build.week}`);
      return;
    }
    if (pendingPick?.kind === "unit") return placeUnit(index, pendingPick.slug);
    if (pendingPick?.kind === "item") return equipItem(index, pendingPick.slug);
    setActiveSlot(index);
    const unit = unitBySlug.get(build.slots[index].unitSlug);
    setCatalogPreview(null);
    setMessage(unit ? `${unit.name} selected · drag equipment here` : `Slot ${index + 1} selected · choose or drag a unit`);
  }

  function handleBoardDrop(index: number, event: DragEvent) {
    event.preventDefault();
    finishDrag();
    if (index < 0 || index >= BOARD_CELLS) return;
    const payload = readDrag(event);
    if (!payload) return;
    if (payload.kind === "unit" && payload.slug) placeUnit(index, payload.slug);
    if (payload.kind === "item" && payload.slug) equipItem(index, payload.slug, payload.from);
    if (payload.kind === "slot" && payload.from !== undefined) moveBoardSlot(payload.from, index);
  }

  function handleLeaderDrop(event: DragEvent) {
    event.preventDefault();
    finishDrag();
    const payload = readDrag(event);
    if (payload?.kind !== "leader" || !payload.slug) return;
    assignLeader(payload.slug);
  }

  function assignLeader(slug: string) {
    const leader = leaderBySlug.get(slug);
    if (!leader) return;
    if (lockedUnitCount > 0) {
      setMessage(`Cannot assign ${leader.name} · move ${lockedUnitCount} follower(s) out of locked positions first`);
      return;
    }
    if (build.mode !== "Multiplayer") {
      const incompatibleFollowers = build.slots.filter((slot) => {
        const unit = unitBySlug.get(slot.unitSlug);
        return unit && unit.factionSlug !== leader.factionSlug;
      }).length;
      if (incompatibleFollowers > 0) {
        setMessage(`Cannot assign ${leader.name} · remove ${incompatibleFollowers} follower(s) from other factions first`);
        return;
      }
    }
    const nextLimit = followerLimitForRules(build.week, build.mode, leader.factionSlug);
    if (filledCount > nextLimit) {
      setMessage(`Cannot assign ${leader.name} · remove ${filledCount - nextLimit} follower(s) to meet the ${nextLimit} cap`);
      return;
    }
    setBuild((current) => ({ ...current, leaderSlug: slug }));
    setTab("units");
    setFaction(build.mode === "Multiplayer" ? "all" : leader.factionSlug);
    setQuery("");
    setMessage(`${leader.name} assigned · ${followerCapLabel(build.mode, leader.factionSlug)}`);
  }

  function changeMode(mode: string) {
    const nextLimit = followerLimitForRules(build.week, mode, selectedLeader?.factionSlug);
    if (selectedLeader && filledCount > nextLimit) {
      setMessage(`Cannot switch ruleset · remove ${filledCount - nextLimit} follower(s) first`);
      return;
    }
    if (selectedLeader && mode !== "Multiplayer") {
      const incompatibleFollowers = build.slots.filter((slot) => {
        const unit = unitBySlug.get(slot.unitSlug);
        return unit && unit.factionSlug !== selectedLeader.factionSlug;
      }).length;
      if (incompatibleFollowers > 0) {
        setMessage(`Cannot switch ruleset · remove ${incompatibleFollowers} follower(s) from other factions first`);
        return;
      }
    }
    setBuild((current) => ({ ...current, mode }));
    setMessage(`${mode} rules applied`);
  }

  function changeWeek(week: number) {
    const nextCells = activeBoardCells(week);
    const unitsOutsideNextBoard = build.slots.filter((slot, index) => slot.unitSlug && !nextCells.has(index)).length;
    const nextLimit = followerLimitForRules(week, build.mode, selectedLeader?.factionSlug);
    if (unitsOutsideNextBoard > 0) {
      setMessage(`Cannot switch to week ${week} · move ${unitsOutsideNextBoard} follower(s) out of locked positions first`);
      return;
    }
    if (selectedLeader && filledCount > nextLimit) {
      setMessage(`Cannot switch to week ${week} · remove ${filledCount - nextLimit} follower(s) first`);
      return;
    }
    setBuild((current) => ({ ...current, week }));
    setMessage(`Week ${week} board applied · ${nextLimit} follower slots available`);
  }

  function clearBuild() {
    setBuild(emptyBuild());
    setActiveSlot(0);
    setPendingPick(null);
    setTab("leaders");
    setFaction("all");
    setQuery("");
    setMessage("Company cleared · choose a leader to begin");
  }

  function removeUnit(index: number) {
    const unitName = unitBySlug.get(build.slots[index]?.unitSlug ?? "")?.name ?? "Unit";
    updateSlot(index, { unitSlug: "", itemSlugs: [] });
    setPendingPick(null);
    setMessage(`${unitName} removed from ${String.fromCharCode(65 + Math.floor(index / BOARD_COLUMNS))}${index % BOARD_COLUMNS + 1}`);
  }

  function removeLeader() {
    if (!selectedLeader) return;
    if (filledCount > 0) {
      setMessage("The leader must stay with the company · remove followers first");
      return;
    }
    setBuild((current) => ({ ...current, leaderSlug: "" }));
    setTab("leaders");
    setFaction("all");
    setMessage(`${selectedLeader.name} removed from the leader slot`);
  }

  function equipmentFor(slot: BuilderSlot, kind: EquipmentKind) {
    return slot.itemSlugs.map((slug) => itemBySlug.get(slug)).filter((item): item is Item => item !== undefined && itemKind(item) === kind);
  }

  function rotateFormationRow(rowIndex: number) {
    const rowCells = Array.from({ length: BOARD_COLUMNS }, (_, column) => rowIndex * BOARD_COLUMNS + column).filter((index) => availableCells.has(index));
    if (rowCells.length < 2) {
      setMessage(`Row ${rowIndex + 1} is not available in week ${build.week}`);
      return;
    }
    setBuild((current) => {
      const slots = [...current.slots];
      const last = slots[rowCells[rowCells.length - 1]];
      for (let offset = rowCells.length - 1; offset > 0; offset -= 1) slots[rowCells[offset]] = slots[rowCells[offset - 1]];
      slots[rowCells[0]] = last;
      return { ...current, slots };
    });
    const activeIndex = rowCells.indexOf(activeSlot);
    if (activeIndex >= 0) setActiveSlot(rowCells[(activeIndex + 1) % rowCells.length]);
    setMessage(`Formation row ${rowIndex + 1} shifted right`);
  }

  return (
    <section id="company-builder" className={`container ${styles.builder}`} aria-label="Company builder" onDragOver={trackDragPosition}>
      <div className={styles.toolbar}>
        <label className={styles.titleField}><span>Company name</span><input value={build.title} maxLength={64} onChange={(event) => setBuild({ ...build, title: event.target.value })} /></label>
        <div className={styles.planControls} aria-label="Company rules">
          <label><span>Game mode</span><select value={build.mode} onChange={(event) => changeMode(event.target.value)}>{MODES.map((mode) => <option key={mode}>{mode}</option>)}</select></label>
          <label><span>Trial week</span><select value={build.week} onChange={(event) => changeWeek(Number(event.target.value))}>{Array.from({ length: MAX_TRIAL_WEEK }, (_, index) => index + 1).map((week) => <option value={week} key={week}>Week {week}</option>)}</select></label>
        </div>
        <div className={styles.toolbarStatus}>
          <div><span>Current action</span><strong aria-live="polite">{message}</strong><small>Changes save automatically on this device</small></div>
          <button className={styles.clearButton} type="button" onClick={clearBuild}>Clear company</button>
        </div>
      </div>

      {pendingPick && <div className={styles.carryBar} role="status">
        <strong>Carrying · {pendingLabel ?? (pendingPick.kind === "unit" ? "Unit" : "Item")}</strong>
        <span>Scroll normally, then click a valid {pendingPick.kind === "unit" ? "empty board cell" : "unit card"} to place it.</span>
        <button type="button" onClick={() => { setPendingPick(null); setMessage("Carry cancelled"); }}>Cancel</button>
      </div>}
      {draggingPayload && <div className={styles.dragScrollGuide} aria-hidden="true">Move to the top or bottom edge to auto-scroll</div>}

      <div className={styles.workbench}>
        <section className={`${styles.gamePanel} ${styles.boardPanel}`}>
          <header className={styles.panelHeader}><strong>Board [{filledCount}/{followerLimit}]</strong><span>Official placement rules · v0.302</span></header>
          <div className={styles.boardStage}>
            <div className={`${styles.rulesStrip} ${rulesInvalid ? styles.rulesInvalid : ""}`}><strong>{selectedLeader ? rulesSummary : "Leader required"}</strong><span>Week {build.week} · {availableCells.size} active cells · leader occupies one combatant slot</span></div>
            <div className={styles.boardTopbar}>
              <div className={styles.leaderDock} onDragOver={(event) => event.preventDefault()} onDrop={handleLeaderDrop}>
                <button className={styles.leaderDockMain} type="button" onClick={() => setTab("leaders")}>
                  <span className={styles.dockLabel}>Leader</span>
                  <b>{selectedLeader?.name ?? "+ ASSIGN LEADER"}</b>
                  <small>{selectedLeader ? `${selectedLeader.trait.name} · ${selectedLeader.faction}` : "Drag a leader here or open Leaders"}</small>
                </button>
                {selectedLeader && <button className={styles.removeLeaderButton} type="button" onClick={removeLeader} aria-label={`Remove ${selectedLeader.name} as leader`} title="Remove leader">×</button>}
              </div>
              <div className={styles.boardLegend}><span><i /> Open</span><span><i /> Occupied</span><span><i /> Locked</span><strong>Only active cells within the follower cap accept units</strong></div>
            </div>
            <div className={styles.formationLayout}>
              <div className={styles.rowControls} aria-label="Formation row controls">
                {Array.from({ length: BOARD_ROWS }, (_, rowIndex) => {
                  const rowIsAvailable = Array.from({ length: BOARD_COLUMNS }, (_, column) => rowIndex * BOARD_COLUMNS + column).some((index) => availableCells.has(index));
                  return <button type="button" key={rowIndex} disabled={!rowIsAvailable} onClick={() => rotateFormationRow(rowIndex)} title={rowIsAvailable ? `Shift active cells in formation row ${rowIndex + 1} right` : `Row ${rowIndex + 1} is locked in week ${build.week}`}><b>↻</b><small>ROW {rowIndex + 1}</small></button>;
                })}
              </div>
              <div className={styles.boardGrid}>
                {build.slots.map((slot, index) => {
                const unit = unitBySlug.get(slot.unitSlug);
                const cellAvailable = availableCells.has(index);
                const gearItems = equipmentFor(slot, "gear");
                const trinketItems = equipmentFor(slot, "trinkets");
                const consumables = equipmentFor(slot, "consumable");
                const usage = slotUsage(slot);
                const capacity = unit ? slotCapacity(slot, unit) : { gear: 0, trinkets: 0 };
                return <article
                  className={`${styles.boardSlot} ${cellAvailable ? "" : styles.lockedSlot} ${unit ? styles.occupiedSlot : ""} ${activeSlot === index ? styles.activeSlot : ""} ${dropTarget === index ? styles.dropSlot : ""}`}
                  key={index}
                  draggable={Boolean(unit)}
                  onDragStart={(event) => unit && startDrag(event, { kind: "slot", from: index })}
                  onDragEnd={finishDrag}
                  onDragOver={(event) => {
                    if (draggingPayload && canDropOnCell(index, draggingPayload)) {
                      event.preventDefault();
                      setDropTarget(index);
                    } else {
                      setDropTarget((current) => current === index ? null : current);
                    }
                  }}
                  onMouseLeave={() => setDropTarget((current) => current === index ? null : current)}
                  onDrop={(event) => handleBoardDrop(index, event)}
                >
                  {unit && <button className={styles.removeUnitButton} type="button" draggable={false} onClick={(event) => { event.stopPropagation(); removeUnit(index); }} aria-label={`Remove ${unit.name} from ${String.fromCharCode(65 + Math.floor(index / BOARD_COLUMNS))}${index % BOARD_COLUMNS + 1}`} title="Remove unit">×</button>}
                  <button className={styles.boardSlotMain} type="button" aria-disabled={!cellAvailable && !unit} onClick={() => handleBoardClick(index)}>
                    <span className={styles.slotNumber}>{String.fromCharCode(65 + Math.floor(index / BOARD_COLUMNS))}{index % BOARD_COLUMNS + 1}</span>
                    {unit ? <>
                      <span className={styles.miniTitle}><small>{unit.faction}</small><b>{unit.name}</b></span>
                      <UnitSprite src={unit.image} color="#e8e8e8" large />
                      {unit.stats ? <><div className={styles.miniVitals}><span>ES {unit.stats.es}</span><span>HP {unit.stats.hp}</span><span>MP {unit.stats.mp}</span></div><div className={styles.miniAttrs}><b>{unit.stats.str}</b><b>{unit.stats.agi}</b><b>{unit.stats.int}</b></div></> : <span className={styles.pendingStats}>PUBLIC STATS PENDING</span>}
                    </> : cellAvailable ? <><span className={styles.emptyCell}>+</span><b className={styles.emptyText}>{pendingPick ? "PLACE HERE" : "OPEN"}</b></> : <span className={styles.lockedCell}><b>×</b><small>LOCKED</small></span>}
                  </button>
                  {unit && <div className={styles.loadoutDock}>
                    <div><label>Gear {usage.gear}/{unit.gear === undefined ? "?" : capacity.gear}</label><span className={styles.itemSlots}>{gearItems.map((item) => <button key={item.slug} type="button" draggable onDragStart={(event) => { event.stopPropagation(); startDrag(event, { kind: "item", slug: item.slug, from: index }); }} onDragEnd={finishDrag} onClick={() => removeItem(index, item.slug)} aria-label={`Remove ${item.name}`} title={`Drag to transfer or click × to remove ${item.name}`}><Image src={item.image} alt="" width={24} height={24} unoptimized={item.image.endsWith(".gif")} /></button>)}{Array.from({ length: Math.max(0, capacity.gear - usage.gear) }, (_, emptyIndex) => <i key={emptyIndex} />)}</span></div>
                    <div><label>Trinkets {usage.trinkets}/{unit.trinkets === undefined ? "?" : capacity.trinkets}</label><span className={styles.itemSlots}>{trinketItems.map((item) => <button key={item.slug} type="button" draggable onDragStart={(event) => { event.stopPropagation(); startDrag(event, { kind: "item", slug: item.slug, from: index }); }} onDragEnd={finishDrag} onClick={() => removeItem(index, item.slug)} aria-label={`Remove ${item.name}`} title={`Drag to transfer or click × to remove ${item.name}`}><Image src={item.image} alt="" width={24} height={24} unoptimized={item.image.endsWith(".gif")} /></button>)}{Array.from({ length: Math.max(0, capacity.trinkets - usage.trinkets) }, (_, emptyIndex) => <i key={emptyIndex} />)}</span></div>
                    {consumables.length > 0 && <div className={styles.consumables}><label>Use</label><span className={styles.itemSlots}>{consumables.map((item) => <button key={item.slug} type="button" draggable onDragStart={(event) => { event.stopPropagation(); startDrag(event, { kind: "item", slug: item.slug, from: index }); }} onDragEnd={finishDrag} onClick={() => removeItem(index, item.slug)} aria-label={`Remove ${item.name}`} title={`Drag to transfer or click × to remove ${item.name}`}><Image src={item.image} alt="" width={24} height={24} /></button>)}</span></div>}
                  </div>}
                </article>;
                })}
              </div>
              <aside className={styles.formationRail} aria-label="Formation row occupancy">
                {Array.from({ length: BOARD_ROWS }, (_, rowIndex) => {
                  const rowCount = build.slots.slice(rowIndex * BOARD_COLUMNS, (rowIndex + 1) * BOARD_COLUMNS).filter((slot) => slot.unitSlug).length;
                  const rowIsAvailable = Array.from({ length: BOARD_COLUMNS }, (_, column) => rowIndex * BOARD_COLUMNS + column).some((index) => availableCells.has(index));
                  return <div className={rowIsAvailable ? "" : styles.lockedRail} key={rowIndex}><span>◈</span><b>FORMATION {rowIndex + 1}</b><small>{rowIsAvailable ? `${rowCount} ${rowCount === 1 ? "unit" : "units"} positioned` : `Locked · week ${build.week}`}</small></div>;
                })}
              </aside>
            </div>
            {previewUnit && <aside className={`${styles.gamePanel} ${styles.hoverInspect}`} aria-live="polite">
              <header className={styles.panelHeader}><strong>Inspect · Unit</strong><span>Archive hover</span></header>
              <div className={styles.inspectCard}>
                <header><small>{previewUnit.faction}</small><h2>{previewUnit.name}</h2><span>{previewUnit.verified ? "PUBLIC CARD · v0.301" : "ROSTER RECORD"}</span></header>
                <div className={styles.inspectStage}>
                  <div className={styles.slotPreview}><small>GEAR: {previewUnit.gear ?? "?"}</small><span>{Array.from({ length: previewUnit.gear ?? 2 }, (_, index) => <i key={index} />)}</span></div>
                  <UnitSprite src={previewUnit.image} color="#eeeeee" large />
                  <div className={styles.slotPreview}><small>TRINKETS: {previewUnit.trinkets ?? "?"}</small><span>{Array.from({ length: previewUnit.trinkets ?? 1 }, (_, index) => <i key={index} />)}</span></div>
                </div>
                {previewUnit.stats ? <>
                  <div className={styles.resources}><ResourceBar label="ES" value={previewUnit.stats.es} suffix="+0/s" maximum={45} /><ResourceBar label="HP" value={previewUnit.stats.hp} suffix={previewUnit.recovery} maximum={40} /><ResourceBar label="MP" value={previewUnit.stats.mp} suffix={previewUnit.manaRegen} maximum={35} /></div>
                  <div className={styles.attributes}><div><span>STR</span><b>{previewUnit.stats.str}</b></div><div><span>AGI</span><b>{previewUnit.stats.agi}</b></div><div><span>INT</span><b>{previewUnit.stats.int}</b></div></div>
                  <div className={styles.combatStats}><span><b>ATK</b>{previewUnit.stats.atk}</span><span><b>CRT</b>{previewUnit.stats.crt}%</span><span><b>RNG</b>{previewUnit.stats.rng}</span><span><b>SPD</b>{previewUnit.stats.spd > 0 ? "+" : ""}{previewUnit.stats.spd}%</span><span><b>AR</b>{previewUnit.stats.ar}</span><span><b>EVA</b>{previewUnit.stats.eva}%</span></div>
                  <section className={styles.inspectText}><h3>Trait</h3><p><strong>{previewUnit.trait}</strong> — {previewUnit.traitEffect}</p><h3>Skills</h3>{previewUnit.skills?.map((skill) => <p key={skill.name}><strong>{skill.name}</strong> — {skill.effect}</p>)}<h3>Tactics</h3><p><strong>{previewUnit.tactic}</strong> — {previewUnit.tacticEffect}</p></section>
                  {previewUnit.quote && <blockquote>“{previewUnit.quote}”</blockquote>}
                </> : <div className={styles.pendingPanel}><strong>PUBLIC STATS PENDING</strong><p>The official roster confirms this name and artwork, but a complete public card is not available in the verified source layer.</p></div>}
              </div>
            </aside>}
            {previewItem && <aside className={`${styles.gamePanel} ${styles.hoverInspect}`} aria-live="polite">
              <header className={styles.panelHeader}><strong>Inspect · Item</strong><span>Archive hover</span></header>
              <div className={styles.catalogInspect}>
                <header><small>{previewItem.type}</small><h2>{previewItem.name}</h2><span>{previewItem.gameVersion}</span></header>
                <div className={styles.itemInspectStage}>
                  <Image src={previewItem.image} alt="" width={96} height={96} unoptimized={previewItem.image.endsWith(".gif")} />
                  <div><small>SHOP COST</small><strong>{previewItem.cost}G</strong><span>{previewItem.requirements ? `REQUIRES ${previewItem.requirements}` : "NO REQUIREMENT LISTED"}</span></div>
                </div>
                <section className={styles.catalogEffects}><h3>Effects</h3>{previewItem.effects.map((effect) => <p key={effect}>{effect}</p>)}</section>
                <footer>VERIFIED {previewItem.lastVerified}</footer>
              </div>
            </aside>}
            {previewLeader && <aside className={`${styles.gamePanel} ${styles.hoverInspect}`} aria-live="polite">
              <header className={styles.panelHeader}><strong>Inspect · Leader</strong><span>Archive hover</span></header>
              <div className={styles.catalogInspect}>
                <header><small>{previewLeader.faction}</small><h2>{previewLeader.name}</h2><span>{previewLeader.epithet}</span></header>
                <div className={styles.leaderInspectStage}><span className={styles.leaderGlyph}>{previewLeader.name.slice(0, 1)}</span><strong>Company Leader</strong></div>
                <div className={styles.resources}><ResourceBar label="ES" value={previewLeader.stats.es} maximum={45} /><ResourceBar label="HP" value={previewLeader.stats.hp} maximum={40} /><ResourceBar label="MP" value={previewLeader.stats.mp} maximum={35} /></div>
                <div className={styles.attributes}><div><span>STR</span><b>{previewLeader.stats.str}</b></div><div><span>AGI</span><b>{previewLeader.stats.agi}</b></div><div><span>INT</span><b>{previewLeader.stats.int}</b></div></div>
                <section className={styles.catalogEffects}><h3>Leader Trait</h3><p><strong>{previewLeader.trait.name}</strong> — {previewLeader.trait.effect}</p></section>
              </div>
            </aside>}
          </div>
          <footer className={styles.boardFooter}><span>{build.mode} · week {build.week}</span><span>{filledCount}/{followerLimit} followers</span><span>{itemCost}G known item cost</span></footer>
        </section>

        <section className={`${styles.gamePanel} ${styles.shopPanel}`}>
          <header className={styles.panelHeader}><strong>Archive [{tab === "units" ? filteredUnits.length : tab === "items" ? filteredItems.length : filteredLeaders.length}]</strong><span>{tab === "units" && selectedLeader ? `${filledCount}/${followerLimit} followers · drag or click to carry` : "Hover to inspect · drag or click to carry"}</span></header>
          <div className={styles.tabs} role="tablist" aria-label="Builder archive">{(["units", "items", "leaders"] as CatalogTab[]).map((catalogTab) => <button role="tab" aria-selected={tab === catalogTab} className={tab === catalogTab ? styles.selected : ""} type="button" key={catalogTab} onClick={() => { setTab(catalogTab); setQuery(""); setPendingPick(null); setCatalogPreview(null); }}>{catalogTab}</button>)}</div>
          <div className={styles.filters}><input aria-label="Search archive" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${tab}…`} />{tab !== "items" && <select aria-label="Filter by faction" value={faction} onChange={(event) => setFaction(event.target.value)}><option value="all">All factions</option><option value="goodly-folk">Goodly Folk</option><option value="bone-host">Bone Host</option><option value="belowborn">Belowborn</option></select>}</div>
          <div className={styles.archiveHelp}><strong>Long move?</strong><span>Click a record, scroll normally, then click its target.</span></div>
          <div className={styles.archiveList} role="tabpanel">
            {tab === "units" && filteredUnits.map((unit, index) => {
              const blockReason = unitArchiveBlockReason(unit);
              return <button
                className={`${styles.archiveUnit} ${blockReason ? styles.archiveBlocked : ""} ${pendingPick?.kind === "unit" && pendingPick.slug === unit.slug ? styles.picked : ""}`}
                type="button" key={unit.slug} draggable={!blockReason} aria-disabled={Boolean(blockReason)} data-reason={blockReason ?? undefined}
                onDragStart={(event) => { if (blockReason) event.preventDefault(); else startDrag(event, { kind: "unit", slug: unit.slug }); }}
                onDragEnd={finishDrag}
                onMouseEnter={() => showCatalogPreview("unit", unit.slug)}
                onMouseLeave={() => clearCatalogPreview("unit", unit.slug)}
                onFocus={() => showCatalogPreview("unit", unit.slug)}
                onBlur={() => clearCatalogPreview("unit", unit.slug)}
                onClick={() => {
                  showCatalogPreview("unit", unit.slug);
                  if (blockReason) {
                    setPendingPick(null);
                    setMessage(blockReason === "LEADER REQUIRED" ? "Assign a leader before placing followers" : blockReason === "FACTION LOCKED" ? `${unit.name} is outside the selected leader's faction` : `Board is full (${filledCount}/${followerLimit} followers)`);
                    return;
                  }
                  setPendingPick({ kind: "unit", slug: unit.slug });
                  setMessage(`${unit.name} picked up · tap an active empty board cell`);
                }}
              >
                <span className={styles.archiveIndex}>{index + 1}</span>
                <UnitSprite src={unit.image} color="#e6e6e6" />
                <span className={styles.archiveIdentity}><small>{unit.faction}</small><strong>{unit.name}</strong><em>{unit.verified ? `${unit.trait} · ${unit.tactic}` : "Roster name verified · public stats pending"}</em></span>
                {unit.stats ? <span className={styles.archiveStats}><i>HP {unit.stats.hp}</i><i>STR {unit.stats.str}</i><i>AGI {unit.stats.agi}</i><i>INT {unit.stats.int}</i></span> : <span className={styles.unverifiedTag}>NAME ONLY</span>}
              </button>;
            })}
            {tab === "items" && filteredItems.map((item, index) => {
              const blockReason = itemArchiveBlockReason(item);
              return <button
                className={`${styles.archiveItem} ${blockReason ? styles.archiveBlocked : ""} ${pendingPick?.kind === "item" && pendingPick.slug === item.slug ? styles.picked : ""}`}
                type="button" key={item.slug} draggable={!blockReason} aria-disabled={Boolean(blockReason)} data-reason={blockReason ?? undefined}
                onDragStart={(event) => { if (blockReason) event.preventDefault(); else startDrag(event, { kind: "item", slug: item.slug }); }}
                onDragEnd={finishDrag}
                onMouseEnter={() => showCatalogPreview("item", item.slug)}
                onMouseLeave={() => clearCatalogPreview("item", item.slug)}
                onFocus={() => showCatalogPreview("item", item.slug)}
                onBlur={() => clearCatalogPreview("item", item.slug)}
                onClick={() => {
                  showCatalogPreview("item", item.slug);
                  if (blockReason) {
                    setPendingPick(null);
                    setMessage(blockReason === "PLACE UNIT FIRST" ? "Place a unit before assigning equipment" : `${item.name} has no compatible open slot on the board`);
                    return;
                  }
                  setPendingPick({ kind: "item", slug: item.slug });
                  setMessage(`${item.name} picked up · tap a compatible unit card`);
                }}
              >
                <span className={styles.archiveIndex}>{index + 1}</span><Image src={item.image} alt="" width={48} height={48} unoptimized={item.image.endsWith(".gif")} /><span className={styles.archiveIdentity}><small>{item.type}</small><strong>{item.name}</strong><em>{item.effects.slice(0, 2).join(" · ")}</em></span><b>{item.cost}G</b>
              </button>;
            })}
            {tab === "leaders" && filteredLeaders.map((leader, index) => <button
              className={`${styles.archiveLeader} ${build.leaderSlug === leader.slug ? styles.picked : ""}`}
              type="button" key={leader.slug} draggable
              onDragStart={(event) => startDrag(event, { kind: "leader", slug: leader.slug })}
              onDragEnd={finishDrag}
              onMouseEnter={() => showCatalogPreview("leader", leader.slug)}
              onMouseLeave={() => clearCatalogPreview("leader", leader.slug)}
              onFocus={() => showCatalogPreview("leader", leader.slug)}
              onBlur={() => clearCatalogPreview("leader", leader.slug)}
              onClick={() => { showCatalogPreview("leader", leader.slug); if (build.leaderSlug === leader.slug) removeLeader(); else assignLeader(leader.slug); }}
            >
              <span className={styles.archiveIndex}>{index + 1}</span><span className={styles.leaderGlyph}>{leader.name.slice(0, 1)}</span><span className={styles.archiveIdentity}><small>{leader.faction}</small><strong>{leader.name}</strong><em>{leader.trait.name} · {leader.trait.effect}</em></span>
            </button>)}
          </div>
        </section>

      </div>

      <div className={styles.notesPanel}><label><span>Player notes</span><textarea value={build.notes} maxLength={280} onChange={(event) => setBuild({ ...build, notes: event.target.value })} placeholder="Record positioning, shopping priorities, trait assumptions, or questions for other players…" /></label><aside><strong>Builder controls</strong><p>Choose a leader and trial week first. The Board enforces unlocked positions, faction or multiplayer follower caps, one unit per cell, and each verified unit&apos;s Gear and Trinket capacity. Hover, focus, or tap a record in the Archive to inspect it; blocked records show why they cannot be dragged.</p><p>Placement limits were verified against the official live v0.302 game client on 2026-08-20. Public unit cards remain labeled by their own source version; the Builder does not claim strength or legality beyond the rules enforced here.</p></aside></div>
    </section>
  );
}
