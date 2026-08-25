import type { FactionSlug, UnitStats } from "@/types/game";

export type BuilderPlanSlot = { unitSlug: string; itemSlugs: string[] };

export type BuilderPlanState = {
  title: string;
  mode: string;
  week: number;
  leaderSlug: string;
  slots: BuilderPlanSlot[];
  notes: string;
};

export type BuilderPlanCatalog = {
  unitFactionBySlug: ReadonlyMap<string, FactionSlug>;
  leaderFactionBySlug: ReadonlyMap<string, FactionSlug>;
  itemSlugs: ReadonlySet<string>;
  uniqueItemSlugs: ReadonlySet<string>;
};

export type BuilderRosterUnit = {
  slug: string;
  name: string;
  faction: string;
  factionSlug: FactionSlug;
  accent: string;
  image: string;
  verified: boolean;
  cost?: number;
  gameVersion?: string;
  gear?: number;
  trinkets?: number;
  stats?: UnitStats;
  trait?: string;
  traitEffect?: string;
  baseEffects?: string[];
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
  image?: string;
  trait: { name: string; effect: string };
  stats: Pick<UnitStats, "es" | "hp" | "mp" | "str" | "agi" | "int">;
};
