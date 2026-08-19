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
  gear?: number;
  trinkets?: number;
  recovery?: string;
  manaRegen?: string;
  stats: UnitStats;
  trait: { name: string; effect: string; cap?: string };
  skills: { name: string; effect: string }[];
  tactic: { name: string; effect: string };
  gameVersion: string;
  lastVerified: string;
  source: string;
};

export type Item = {
  slug: string;
  name: string;
  type: string;
  image: string;
  requirements?: string;
  effects: string[];
  cost: number;
  gameVersion: string;
  lastVerified: string;
  source: string;
};

export type Faction = {
  slug: FactionSlug;
  name: string;
  image: string;
  accent: string;
  summary: string;
  playstyle: string;
  roster: string[];
};

export type Guide = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  updated: string;
};

export type Build = {
  slug: string;
  title: string;
  unitSlug: string;
  faction: string;
  difficulty: string;
  version: string;
  summary: string;
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
