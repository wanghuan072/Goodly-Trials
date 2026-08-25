import type { ContentTdk } from "@/types/seo";

export type FactionSlug = "goodly-folk" | "bone-host" | "belowborn";

export type UnitStats = {
  es: number;
  hp: number;
  mp: number;
  str: number;
  agi: number;
  int: number;
  atk: number;
  crt: number;
  rng: number;
  spd: number;
  ar: number;
  eva: number;
};

export type Unit = {
  slug: string;
  name: string;
  faction: string;
  factionSlug: FactionSlug;
  image: string;
  accent: string;
  summary: string;
  quote: string;
  cost?: number;
  gear?: number;
  trinkets?: number;
  recovery?: string;
  manaRegen?: string;
  stats: UnitStats;
  trait: { name: string; effect: string; cap?: string };
  baseEffects?: string[];
  skills: { name: string; effect: string }[];
  tactic: { name: string; effect: string };
  gameVersion: string;
  lastVerified: string;
  source: string;
  tdk: ContentTdk;
};

export type Item = {
  slug: string;
  name: string;
  type: string;
  image: string;
  requirements?: string;
  effects: string[];
  cost?: number;
  gameVersion: string;
  lastVerified: string;
  source: string;
  tdk: ContentTdk;
};

export type Trait = {
  slug: string;
  name: string;
  effect: string;
  cap?: string;
  unitSlug: string;
  unitName: string;
  faction: string;
  gameVersion: string;
  lastVerified: string;
  source: string;
  tdk: ContentTdk;
};

export type Faction = {
  slug: FactionSlug;
  name: string;
  image: string;
  accent: string;
  summary: string;
  playstyle: string;
  roster: string[];
  tdk: ContentTdk;
};

export type GameUpdate = {
  slug: string;
  version: string;
  date: string;
  title: string;
  type: string;
  summary: string;
  impact: string;
  source: string;
};

export type Leader = {
  slug: string;
  name: string;
  epithet: string;
  faction: string;
  factionSlug: FactionSlug;
  gear: number;
  trinkets: number;
  stats: Pick<UnitStats, "es" | "hp" | "mp" | "str" | "agi" | "int">;
  trait: { name: string; effect: string };
  gameVersion: string;
  lastVerified: string;
  source: string;
  tdk: ContentTdk;
};
