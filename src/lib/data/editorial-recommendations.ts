import { itemKind, itemSlotUse } from "../builder/equipment-rules.ts";
import type { Item, Leader, Unit } from "../../types/content.ts";

type AttributeKey = "str" | "agi" | "int";
type GearMatch = { item: Item; reason: string };

const requirementKeys: Record<string, AttributeKey> = {
  STR: "str",
  AGI: "agi",
  INT: "int",
};

function meetsRequirements(unit: Unit, requirements?: string) {
  if (!requirements) return true;
  return [...requirements.matchAll(/(\d+)\s+(STR|AGI|INT)/g)].every(([, value, label]) => unit.stats[requirementKeys[label]] >= Number(value));
}

function hasCapacity(unit: Unit, item: Item) {
  const use = itemSlotUse(item);
  return use.gear <= (unit.gear ?? 0) && use.trinkets <= (unit.trinkets ?? 0);
}

function requirementReason(unit: Unit, item: Item) {
  const use = itemSlotUse(item);
  const slot = use.gear > 0
    ? `${use.gear} Gear slot${use.gear === 1 ? "" : "s"}`
    : `${use.trinkets} Trinket slot${use.trinkets === 1 ? "" : "s"}`;
  return `${item.requirements ? `Meets ${item.requirements}` : "No listed attribute requirement"} and has capacity for ${slot}.`;
}

/**
 * These are compatibility checks, not best-in-slot claims. They deliberately
 * use only base attributes, published requirements, and slot capacity.
 */
export function getCompatibleGear(unit: Unit, allItems: Item[]): GearMatch[] {
  return allItems
    .filter((item) => itemKind(item) !== "consumable")
    .filter((item) => meetsRequirements(unit, item.requirements) && hasCapacity(unit, item))
    .map((item) => ({ item, reason: requirementReason(unit, item) }));
}

export function getCompatibleUnits(item: Item, allUnits: Unit[]) {
  if (itemKind(item) === "consumable") return [];
  return allUnits
    .filter((unit) => meetsRequirements(unit, item.requirements) && hasCapacity(unit, item))
    .map((unit) => ({ unit, reason: requirementReason(unit, item) }));
}

type CompanyPlan = {
  title: string;
  note: string;
  unitSlugs: string[];
};

const verifiedPlans: Record<string, CompanyPlan> = {
  aldric: {
    title: "Adjacency-focused Goodly Folk board",
    note: "Pious Chant reaches adjacent allies, so begin with a compact Formation core and leave its spacing editable as the run develops.",
    unitSlugs: ["goodly-knight", "squire", "goodly-nurse"],
  },
  hobb: {
    title: "Spacing-first Goodly Folk board",
    note: "Cannibalistic affects a random adjacent ally at battle start. Do not treat any fixed neighbour as guaranteed; keep the support line separate while testing the front.",
    unitSlugs: ["portly-knight", "goodly-knight", "archer"],
  },
  ivo: {
    title: "Trinket-shopping Goodly Folk board",
    note: "Speculating lowers Trinket cost by 1G. These linked cards have the INT and Trinket capacity worth comparing when the shop offers spell or trinket gear.",
    unitSlugs: ["wizard", "merchant", "sage"],
  },
  "young-keth": {
    title: "Growing Bone Host frontline",
    note: "Zealous changes Young Keth after each battle. Pair the leader with a simple Formation and Flanking shell, then reassess the board as the attributes change.",
    unitSlugs: ["skeleton-knight", "skeleton-child", "skeleton-archer"],
  },
  "skeleton-knight-plagued": {
    title: "Aura-aware Bone Host spacing",
    note: "Plagued affects both allies and enemies in its listed area. Keep the surrounding cells deliberate instead of assuming a tightly packed company is always safer.",
    unitSlugs: ["skeleton-knight", "skeleton-archer", "skeleton-witness"],
  },
  "arrowheaded-gerry": {
    title: "Strength and armor Belowborn front",
    note: "Iron converts STR into AR. Start with Formation cards that keep the frontline readable, then test the equipment actually available in the run.",
    unitSlugs: ["tunnel-defender", "dwarf-bruiser", "mud-ogre"],
  },
  "dwarf-knower-cavebloom": {
    title: "Spell-supported Belowborn board",
    note: "Cavebloom heals an ally when the leader casts. Compare spell-capable INT cards and keep a target within the trait's listed range instead of treating the heal as a universal team bonus.",
    unitSlugs: ["echo-toad", "dwarf-knower", "observer"],
  },
};

function fallbackPlan(leader: Leader, allUnits: Unit[]): CompanyPlan {
  const factionUnits = allUnits.filter((unit) => unit.factionSlug === leader.factionSlug);
  const roles = ["Formation", "Backline", "Flanking"];
  const unitSlugs = roles
    .map((role) => factionUnits.find((unit) => unit.tactic.name === role)?.slug)
    .filter((slug): slug is string => Boolean(slug));
  return {
    title: `${leader.faction} role-balanced starting board`,
    note: "This leader's full card effect is not yet available here, so this is a faction-based starting frame rather than a leader-specific recommendation. Use the Builder to test the live board and shop.",
    unitSlugs,
  };
}

export function getLeaderCompanyPlan(leader: Leader, allUnits: Unit[]) {
  return verifiedPlans[leader.slug] ?? fallbackPlan(leader, allUnits);
}
