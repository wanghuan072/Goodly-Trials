import buildsData from "@/data/game/builds.json";
import factionsData from "@/data/game/factions.json";
import guidesData from "@/data/game/guides.json";
import itemsData from "@/data/game/items.json";
import leadersData from "@/data/game/leaders.json";
import unitsData from "@/data/game/units.json";
import updatesData from "@/data/game/updates.json";
import type { Build, Faction, Guide, GameUpdate, Item, Leader, Unit } from "@/types/content";

export const units = unitsData as Unit[];
export const items = itemsData as Item[];
export const leaders = leadersData as Leader[];
export const factions = factionsData as Faction[];
export const guides = guidesData as Guide[];
export const builds = buildsData as Build[];
export const updates = updatesData as GameUpdate[];

export const getUnit = (slug: string) => units.find((unit) => unit.slug === slug);
export const getItem = (slug: string) => items.find((item) => item.slug === slug);
export const getFaction = (slug: string) => factions.find((faction) => faction.slug === slug);
export const getGuide = (slug: string) => guides.find((guide) => guide.slug === slug);
export const getBuild = (slug: string) => builds.find((build) => build.slug === slug);
export const getUpdate = (slug: string) => updates.find((update) => update.slug === slug);
