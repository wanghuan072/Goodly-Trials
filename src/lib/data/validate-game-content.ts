import type { Build } from "@/types/build";
import type {
  Faction,
  FactionSlug,
  GameUpdate,
  Item,
  Leader,
  Unit,
  UnitStats,
} from "@/types/game";
import type { Guide } from "@/types/guide";

export type UnitSource = Omit<Unit, "tdk">;
export type ItemSource = Omit<Item, "tdk">;
export type LeaderSource = Omit<Leader, "tdk">;
export type FactionSource = Omit<Faction, "tdk">;
export type GuideSource = Omit<Guide, "tdk">;

export type GameContentSource = {
  units: UnitSource[];
  items: ItemSource[];
  leaders: LeaderSource[];
  factions: FactionSource[];
  guides: GuideSource[];
  builds: Build[];
  updates: GameUpdate[];
};

const FACTIONS = new Set<FactionSlug>(["goodly-folk", "bone-host", "belowborn"]);
const MODES = new Set<Build["mode"]>(["Theorycraft", "Single-player", "Ranked", "Multiplayer"]);
const OFFICIAL_SOURCE_HOSTS = new Set(["goodlytrials.com", "play.goodlytrials.com"]);
const VERSION_PATTERN = /^v\d+\.\d+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(path: string, message: string): never {
  throw new TypeError(`${path}: ${message}`);
}

function assertRecord(value: unknown, path: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(path, "expected an object");
}

function assertString(value: unknown, path: string) {
  if (typeof value !== "string" || !value.trim()) fail(path, "expected a non-empty string");
}

function assertStringValue(value: unknown, path: string) {
  if (typeof value !== "string") fail(path, "expected a string");
}

function assertNumber(value: unknown, path: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) fail(path, "expected a finite number");
}

function assertOptionalNumber(value: unknown, path: string) {
  if (value !== undefined) assertNumber(value, path);
}

function assertStringArray(value: unknown, path: string) {
  if (!Array.isArray(value)) fail(path, "expected an array");
  value.forEach((entry, index) => assertString(entry, `${path}[${index}]`));
}

function assertSlug(value: unknown, path: string) {
  assertString(value, path);
  if (!SLUG_PATTERN.test(value as string)) fail(path, "expected a lowercase kebab-case slug");
}

function assertVersion(value: unknown, path: string) {
  assertString(value, path);
  if (!VERSION_PATTERN.test(value as string)) fail(path, "expected a version such as v0.312");
}

function assertDate(value: unknown, path: string) {
  assertString(value, path);
  if (!DATE_PATTERN.test(value as string) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    fail(path, "expected a valid YYYY-MM-DD date");
  }
}

function assertSource(value: unknown, path: string) {
  assertString(value, path);
  try {
    const url = new URL(value as string);
    if (url.protocol !== "https:" || !OFFICIAL_SOURCE_HOSTS.has(url.hostname)) {
      fail(path, "expected an official Goodly Trials HTTPS source");
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.startsWith(`${path}:`)) throw error;
    fail(path, "expected a valid source URL");
  }
}

function assertFaction(value: unknown, path: string): asserts value is FactionSlug {
  assertString(value, path);
  if (!FACTIONS.has(value as FactionSlug)) fail(path, "expected a supported faction slug");
}

function assertStats(value: unknown, keys: ReadonlyArray<keyof UnitStats>, path: string) {
  assertRecord(value, path);
  keys.forEach((key) => assertNumber(value[key], `${path}.${key}`));
}

function assertNamedEffect(value: unknown, path: string) {
  assertRecord(value, path);
  assertString(value.name, `${path}.name`);
  assertString(value.effect, `${path}.effect`);
}

function assertUnit(value: unknown, path: string): asserts value is UnitSource {
  assertRecord(value, path);
  assertSlug(value.slug, `${path}.slug`);
  ["name", "faction", "image", "accent", "summary", "quote"].forEach((key) => assertString(value[key], `${path}.${key}`));
  assertFaction(value.factionSlug, `${path}.factionSlug`);
  assertOptionalNumber(value.cost, `${path}.cost`);
  assertOptionalNumber(value.gear, `${path}.gear`);
  assertOptionalNumber(value.trinkets, `${path}.trinkets`);
  if (value.recovery !== undefined) assertString(value.recovery, `${path}.recovery`);
  if (value.manaRegen !== undefined) assertString(value.manaRegen, `${path}.manaRegen`);
  assertStats(value.stats, ["es", "hp", "mp", "str", "agi", "int", "atk", "crt", "rng", "spd", "ar", "eva"], `${path}.stats`);
  assertNamedEffect(value.trait, `${path}.trait`);
  if (value.baseEffects !== undefined) assertStringArray(value.baseEffects, `${path}.baseEffects`);
  if (!Array.isArray(value.skills)) fail(`${path}.skills`, "expected an array");
  value.skills.forEach((skill, index) => assertNamedEffect(skill, `${path}.skills[${index}]`));
  assertNamedEffect(value.tactic, `${path}.tactic`);
  assertVersion(value.gameVersion, `${path}.gameVersion`);
  assertDate(value.lastVerified, `${path}.lastVerified`);
  assertSource(value.source, `${path}.source`);
}

function assertItem(value: unknown, path: string): asserts value is ItemSource {
  assertRecord(value, path);
  assertSlug(value.slug, `${path}.slug`);
  ["name", "type", "image"].forEach((key) => assertString(value[key], `${path}.${key}`));
  if (value.requirements !== undefined) assertString(value.requirements, `${path}.requirements`);
  assertStringArray(value.effects, `${path}.effects`);
  assertOptionalNumber(value.cost, `${path}.cost`);
  assertVersion(value.gameVersion, `${path}.gameVersion`);
  assertDate(value.lastVerified, `${path}.lastVerified`);
  assertSource(value.source, `${path}.source`);
}

function assertLeader(value: unknown, path: string): asserts value is LeaderSource {
  assertRecord(value, path);
  assertSlug(value.slug, `${path}.slug`);
  ["name", "faction"].forEach((key) => assertString(value[key], `${path}.${key}`));
  assertStringValue(value.epithet, `${path}.epithet`);
  assertFaction(value.factionSlug, `${path}.factionSlug`);
  assertNumber(value.gear, `${path}.gear`);
  assertNumber(value.trinkets, `${path}.trinkets`);
  assertStats(value.stats, ["es", "hp", "mp", "str", "agi", "int"], `${path}.stats`);
  assertNamedEffect(value.trait, `${path}.trait`);
  assertVersion(value.gameVersion, `${path}.gameVersion`);
  assertDate(value.lastVerified, `${path}.lastVerified`);
  assertSource(value.source, `${path}.source`);
}

function assertFactionRecord(value: unknown, path: string): asserts value is FactionSource {
  assertRecord(value, path);
  assertFaction(value.slug, `${path}.slug`);
  ["name", "image", "accent", "summary", "playstyle"].forEach((key) => assertString(value[key], `${path}.${key}`));
  assertStringArray(value.roster, `${path}.roster`);
}

function assertGuide(value: unknown, path: string): asserts value is GuideSource {
  assertRecord(value, path);
  assertSlug(value.slug, `${path}.slug`);
  ["title", "category", "image", "imageAlt", "excerpt"].forEach((key) => assertString(value[key], `${path}.${key}`));
  assertDate(value.updated, `${path}.updated`);
}

function assertBuild(value: unknown, path: string): asserts value is Build {
  assertRecord(value, path);
  assertSlug(value.slug, `${path}.slug`);
  ["title", "unitSlug", "faction", "difficulty", "summary", "leaderSlug", "bestFor", "planningNote"].forEach((key) => assertString(value[key], `${path}.${key}`));
  assertVersion(value.version, `${path}.version`);
  if (!MODES.has(value.mode as Build["mode"])) fail(`${path}.mode`, "expected a supported build mode");
  assertNumber(value.week, `${path}.week`);
  assertStringArray(value.strengths, `${path}.strengths`);
  assertStringArray(value.weaknesses, `${path}.weaknesses`);
  if (!Array.isArray(value.placements)) fail(`${path}.placements`, "expected an array");
  value.placements.forEach((placement, index) => {
    const placementPath = `${path}.placements[${index}]`;
    assertRecord(placement, placementPath);
    assertNumber(placement.slot, `${placementPath}.slot`);
    assertString(placement.unitSlug, `${placementPath}.unitSlug`);
    assertStringArray(placement.itemSlugs, `${placementPath}.itemSlugs`);
  });
}

function assertUpdate(value: unknown, path: string): asserts value is GameUpdate {
  assertRecord(value, path);
  assertSlug(value.slug, `${path}.slug`);
  ["title", "type", "summary", "impact"].forEach((key) => assertString(value[key], `${path}.${key}`));
  assertVersion(value.version, `${path}.version`);
  assertDate(value.date, `${path}.date`);
  assertSource(value.source, `${path}.source`);
}

function assertCollection<T>(
  value: unknown,
  label: string,
  validator: (entry: unknown, path: string) => asserts entry is T,
): asserts value is T[] {
  if (!Array.isArray(value)) fail(label, "expected an array");
  value.forEach((entry, index) => validator(entry, `${label}[${index}]`));
  const slugs = value.map((entry) => (entry as { slug: string }).slug);
  if (new Set(slugs).size !== slugs.length) fail(label, "contains duplicate slugs");
}

export function assertGameContent(value: unknown): asserts value is GameContentSource {
  assertRecord(value, "gameContent");
  assertCollection(value.units, "units", assertUnit);
  assertCollection(value.items, "items", assertItem);
  assertCollection(value.leaders, "leaders", assertLeader);
  assertCollection(value.factions, "factions", assertFactionRecord);
  assertCollection(value.guides, "guides", assertGuide);
  assertCollection(value.builds, "builds", assertBuild);
  assertCollection(value.updates, "updates", assertUpdate);

  const unitSlugs = new Set(value.units.map((unit) => unit.slug));
  const itemSlugs = new Set(value.items.map((item) => item.slug));
  const leaderSlugs = new Set(value.leaders.map((leader) => leader.slug));
  const factionSlugs = new Set(value.factions.map((faction) => faction.slug));

  value.units.forEach((unit) => {
    if (!factionSlugs.has(unit.factionSlug)) fail(`units.${unit.slug}.factionSlug`, "references an unknown faction");
  });
  value.leaders.forEach((leader) => {
    if (!factionSlugs.has(leader.factionSlug)) fail(`leaders.${leader.slug}.factionSlug`, "references an unknown faction");
  });
  value.builds.forEach((build) => {
    if (!unitSlugs.has(build.unitSlug)) fail(`builds.${build.slug}.unitSlug`, "references an unknown unit");
    if (!leaderSlugs.has(build.leaderSlug)) fail(`builds.${build.slug}.leaderSlug`, "references an unknown leader");
    build.placements.forEach((placement, index) => {
      if (!unitSlugs.has(placement.unitSlug)) fail(`builds.${build.slug}.placements[${index}].unitSlug`, "references an unknown unit");
      placement.itemSlugs.forEach((itemSlug, itemIndex) => {
        if (!itemSlugs.has(itemSlug)) fail(`builds.${build.slug}.placements[${index}].itemSlugs[${itemIndex}]`, "references unknown gear");
      });
    });
  });
}
