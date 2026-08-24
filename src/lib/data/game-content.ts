import buildsData from "@/data/game/builds.json";
import factionsData from "@/data/game/factions.json";
import guidesData from "@/data/game/guides.json";
import itemsData from "@/data/game/items.json";
import leadersData from "@/data/game/leaders.json";
import unitsData from "@/data/game/units.json";
import updatesData from "@/data/game/updates.json";
import { detailTdk } from "@/seo/tdk";
import type {
  Build,
  Faction,
  Guide,
  GameUpdate,
  Item,
  Leader,
  Trait,
  Unit,
} from "@/types/content";

export const units = unitsData.map((unit) => ({ ...unit, tdk: detailTdk.unit(unit) })) as Unit[];
export const items = itemsData.map((item) => ({ ...item, tdk: detailTdk.item(item) })) as Item[];
export const traits: Trait[] = units
  .filter((unit) => unit.trait.name !== "Base client record")
  .map((unit) => ({
  slug: `${unit.slug}-${unit.trait.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`,
  name: unit.trait.name,
  effect: unit.trait.effect,
  cap: unit.trait.cap,
  unitSlug: unit.slug,
  unitName: unit.name,
  faction: unit.faction,
  gameVersion: unit.gameVersion,
  lastVerified: unit.lastVerified,
  source: unit.source,
  tdk: unit.tdk,
  }));
export const leaders = leadersData.map((leader) => ({ ...leader, tdk: detailTdk.leader(leader) })) as Leader[];
export const factions = factionsData.map((faction) => ({ ...faction, tdk: detailTdk.faction(faction) })) as Faction[];
export const guides = guidesData.map((guide) => ({ ...guide, tdk: detailTdk.guide(guide) })) as Guide[];
export const builds = buildsData as Build[];
export const updates = updatesData as GameUpdate[];

export const getUnit = (slug: string) =>
  units.find((unit) => unit.slug === slug);
export const getItem = (slug: string) =>
  items.find((item) => item.slug === slug);
export const getTrait = (slug: string) =>
  traits.find((trait) => trait.slug === slug);
export const getTraitForUnit = (unitSlug: string) =>
  traits.find((trait) => trait.unitSlug === unitSlug);
export const getLeader = (slug: string) =>
  leaders.find((leader) => leader.slug === slug);
export const getFaction = (slug: string) =>
  factions.find((faction) => faction.slug === slug);
export const getGuide = (slug: string) =>
  guides.find((guide) => guide.slug === slug);
export const getBuild = (slug: string) =>
  builds.find((build) => build.slug === slug);
export const getUpdate = (slug: string) =>
  updates.find((update) => update.slug === slug);
