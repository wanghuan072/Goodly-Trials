import { activeBoardCells, BOARD_CELLS, followerLimitForRules, MAX_TRIAL_WEEK } from "./board-rules.ts";
import type { BuilderPlanCatalog, BuilderPlanSlot, BuilderPlanState } from "../../types/builder.ts";

export type { BuilderPlanCatalog, BuilderPlanSlot, BuilderPlanState } from "@/types/builder";

export const BUILDER_STORAGE_KEY = "goodly-trials-company-builder-v2";
export const BUILDER_PRESET_KEY = "goodly-trials-company-preset-v1";
export const BUILDER_MODES = ["Theorycraft", "Single-player", "Ranked", "Multiplayer"] as const;

const LEGACY_SLOT_POSITIONS = [9, 10, 14, 15, 20, 21];
const MAX_ENCODED_PLAN_LENGTH = 64_000;
const MAX_PRESET_LENGTH = 200_000;

export function emptyBuilderSlots(): BuilderPlanSlot[] {
  return Array.from({ length: BOARD_CELLS }, () => ({ unitSlug: "", itemSlugs: [] }));
}

export function emptyBuilderPlan(): BuilderPlanState {
  return { title: "Untitled Company", mode: "Theorycraft", week: 1, leaderSlug: "", slots: emptyBuilderSlots(), notes: "" };
}

function recordFrom(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function normalizeSyntacticState(value: unknown): BuilderPlanState {
  const parsed = recordFrom(value);
  const sourceSlots = Array.isArray(parsed.slots)
    ? parsed.slots.slice(0, BOARD_CELLS).map((value) => {
        const slot = recordFrom(value);
        return {
          unitSlug: typeof slot.unitSlug === "string" ? slot.unitSlug : "",
          itemSlugs: Array.isArray(slot.itemSlugs)
            ? slot.itemSlugs.filter((slug): slug is string => typeof slug === "string").slice(0, 8)
            : [],
        };
      })
    : [];
  const slots = emptyBuilderSlots();
  if (sourceSlots.length <= LEGACY_SLOT_POSITIONS.length) {
    sourceSlots.forEach((slot, index) => { slots[LEGACY_SLOT_POSITIONS[index]] = slot; });
  } else {
    sourceSlots.forEach((slot, index) => { slots[index] = slot; });
  }

  return {
    title: typeof parsed.title === "string" ? parsed.title.slice(0, 64) : "Untitled Company",
    mode: typeof parsed.mode === "string" && BUILDER_MODES.includes(parsed.mode as typeof BUILDER_MODES[number]) ? parsed.mode : "Theorycraft",
    week: typeof parsed.week === "number" ? Math.min(MAX_TRIAL_WEEK, Math.max(1, Math.floor(parsed.week))) : MAX_TRIAL_WEEK,
    leaderSlug: typeof parsed.leaderSlug === "string" ? parsed.leaderSlug : "",
    slots,
    notes: typeof parsed.notes === "string" ? parsed.notes.slice(0, 280) : "",
  };
}

export function normalizeBuilderPlan(value: unknown, catalog?: BuilderPlanCatalog): BuilderPlanState {
  const plan = normalizeSyntacticState(value);
  if (!catalog) return plan;

  const leaderFaction = catalog.leaderFactionBySlug.get(plan.leaderSlug);
  if (!leaderFaction) return { ...plan, leaderSlug: "", slots: emptyBuilderSlots() };

  const activeCells = activeBoardCells(plan.week);
  const followerLimit = followerLimitForRules(plan.week, plan.mode, leaderFaction);
  const uniqueItems = new Set<string>();
  let followerCount = 0;
  const slots = plan.slots.map((slot, index) => {
    const unitFaction = catalog.unitFactionBySlug.get(slot.unitSlug);
    const unitAllowed = Boolean(unitFaction)
      && activeCells.has(index)
      && followerCount < followerLimit
      && (plan.mode === "Multiplayer" || unitFaction === leaderFaction);
    if (!unitAllowed) return { unitSlug: "", itemSlugs: [] };

    followerCount += 1;
    const itemSlugs = [...new Set(slot.itemSlugs)].filter((slug) => {
      if (!catalog.itemSlugs.has(slug)) return false;
      if (!catalog.uniqueItemSlugs.has(slug)) return true;
      if (uniqueItems.has(slug)) return false;
      uniqueItems.add(slug);
      return true;
    });
    return { unitSlug: slot.unitSlug, itemSlugs };
  });

  return { ...plan, slots };
}

export function encodeBuilderPlan(plan: BuilderPlanState) {
  const bytes = new TextEncoder().encode(JSON.stringify(plan));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeBuilderPlan(value: string, catalog?: BuilderPlanCatalog): BuilderPlanState | null {
  if (!value || value.length > MAX_ENCODED_PLAN_LENGTH) return null;
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
    return normalizeBuilderPlan(JSON.parse(new TextDecoder().decode(bytes)), catalog);
  } catch {
    return null;
  }
}

export function decodeBuilderPreset(value: string, catalog?: BuilderPlanCatalog): BuilderPlanState | null {
  if (!value || value.length > MAX_PRESET_LENGTH) return null;
  try {
    return normalizeBuilderPlan(JSON.parse(value), catalog);
  } catch {
    return null;
  }
}
