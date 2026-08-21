import type { MetadataRoute } from "next";
import mechanicsData from "@/data/game/mechanics.json";
import { siteConfig } from "@/config/site";
import { factions, guides, items, leaders, units, updates } from "@/lib/data/game-content";

const staticRoutes = ["", "/wiki", "/wiki/list", "/wiki/units", "/wiki/items", "/wiki/factions", "/wiki/traits", "/wiki/ascendancy", "/wiki/leaders", "/wiki/mechanics", "/guides", "/builder", "/builds", "/tier-list", "/updates", "/about"];

export default function sitemap(): MetadataRoute.Sitemap {
  const verified = new Date(`${siteConfig.lastVerified}T00:00:00Z`);
  const entries = [
    ...staticRoutes.map((path) => ({ url: `${siteConfig.url}${path}`, lastModified: verified, changeFrequency: path === "/updates" ? "daily" as const : "weekly" as const, priority: path === "" ? 1 : path === "/wiki" ? .9 : .75 })),
    ...units.map((unit) => ({ url: `${siteConfig.url}/wiki/units/${unit.slug}`, lastModified: new Date(`${unit.lastVerified}T00:00:00Z`), changeFrequency: "weekly" as const, priority: .8 })),
    ...items.map((item) => ({ url: `${siteConfig.url}/wiki/items/${item.slug}`, lastModified: new Date(`${item.lastVerified}T00:00:00Z`), changeFrequency: "weekly" as const, priority: .72 })),
    ...leaders.map((leader) => ({ url: `${siteConfig.url}/wiki/leaders/${leader.slug}`, lastModified: new Date(`${leader.lastVerified}T00:00:00Z`), changeFrequency: "weekly" as const, priority: .72 })),
    ...factions.map((faction) => ({ url: `${siteConfig.url}/wiki/factions/${faction.slug}`, lastModified: verified, changeFrequency: "weekly" as const, priority: .76 })),
    ...mechanicsData.map((entry) => ({ url: `${siteConfig.url}/wiki/mechanics/${entry.slug}`, lastModified: verified, changeFrequency: "monthly" as const, priority: .7 })),
    ...guides.map((guide) => ({ url: `${siteConfig.url}/guides/${guide.slug}`, lastModified: new Date(`${guide.updated}T00:00:00Z`), changeFrequency: "monthly" as const, priority: .72 })),
    ...updates.map((update) => ({ url: `${siteConfig.url}/updates/${update.slug}`, lastModified: new Date(`${update.date}T00:00:00Z`), changeFrequency: "monthly" as const, priority: .66 })),
  ];
  return entries;
}
