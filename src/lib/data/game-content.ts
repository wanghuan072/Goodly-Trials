import buildsData from "@/data/game/builds.json";
import factionsData from "@/data/game/factions.json";
import guideDetailsData from "@/data/game/guide-details.json";
import guidesData from "@/data/game/guides.json";
import itemsData from "@/data/game/items.json";
import leadersData from "@/data/game/leaders.json";
import unitsData from "@/data/game/units.json";
import updatesData from "@/data/game/updates.json";
import { assertGameContent } from "@/lib/data/validate-game-content";
import { detailTdk } from "@/seo/tdk";
import type { Build } from "@/types/build";
import type {
  Faction,
  GameUpdate,
  Item,
  Leader,
  Trait,
  Unit,
} from "@/types/game";
import type { Guide, GuideDetail } from "@/types/guide";

const rawContent: unknown = {
  units: unitsData,
  items: itemsData,
  leaders: leadersData,
  factions: factionsData,
  guides: guidesData,
  builds: buildsData,
  updates: updatesData,
};

assertGameContent(rawContent);

export const units: Unit[] = rawContent.units.map((unit) => ({ ...unit, tdk: detailTdk.unit(unit) }));
export const items: Item[] = rawContent.items.map((item) => ({ ...item, tdk: detailTdk.item(item) }));
export const traits: Trait[] = units
  .filter((unit) => unit.trait.name !== "Base card")
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
export const leaders: Leader[] = rawContent.leaders.map((leader) => ({ ...leader, tdk: detailTdk.leader(leader) }));
export const factions: Faction[] = rawContent.factions.map((faction) => ({ ...faction, tdk: detailTdk.faction(faction) }));
export const guides: Guide[] = rawContent.guides.map((guide) => ({ ...guide, tdk: detailTdk.guide(guide) }));
export const guideDetails = guideDetailsData as GuideDetail[];
export const builds: Build[] = rawContent.builds;
export const updates: GameUpdate[] = rawContent.updates;

export const getUnit = (slug: string) =>
  units.find((unit) => unit.slug === slug);
export const getItem = (slug: string) =>
  items.find((item) => item.slug === slug);
export const getTraitForUnit = (unitSlug: string) =>
  traits.find((trait) => trait.unitSlug === unitSlug);
export const getLeader = (slug: string) =>
  leaders.find((leader) => leader.slug === slug);
export const getFaction = (slug: string) =>
  factions.find((faction) => faction.slug === slug);
export const getGuide = (slug: string) =>
  guides.find((guide) => guide.slug === slug);
export const getGuideDetail = (slug: string) =>
  guideDetails.find((guide) => guide.slug === slug);
