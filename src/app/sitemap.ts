import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import {
  factions,
  guides,
  items,
  leaders,
  units,
} from "@/lib/data/game-content";

const staticRoutes = [
  { path: "", updated: "2026-08-21", priority: 1 },
  { path: "/wiki", updated: "2026-08-21", priority: 0.9 },
  { path: "/wiki/units", updated: "2026-08-21", priority: 0.8 },
  { path: "/wiki/gear", updated: "2026-08-21", priority: 0.8 },
  { path: "/wiki/factions", updated: "2026-08-21", priority: 0.75 },
  { path: "/wiki/traits", updated: "2026-08-21", priority: 0.75 },
  { path: "/wiki/leaders", updated: "2026-08-21", priority: 0.75 },
  { path: "/guides", updated: "2026-08-21", priority: 0.8 },
  { path: "/builder", updated: "2026-08-21", priority: 0.85 },
  { path: "/builds", updated: "2026-08-21", priority: 0.8 },
  { path: "/updates", updated: "2026-08-21", priority: 0.8 },
  { path: "/about", updated: "2026-08-21", priority: 0.55 },
  { path: "/legal/privacy-policy", updated: "2026-08-21", priority: 0.25 },
  { path: "/legal/terms-of-service", updated: "2026-08-21", priority: 0.25 },
  { path: "/legal/copyright", updated: "2026-08-21", priority: 0.25 },
  { path: "/legal/about-us", updated: "2026-08-21", priority: 0.25 },
  { path: "/legal/contact-us", updated: "2026-08-21", priority: 0.25 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route.path}`,
      lastModified: new Date(`${route.updated}T00:00:00Z`),
      changeFrequency:
        route.path === "/updates" ? ("daily" as const) : ("weekly" as const),
      priority: route.priority,
    })),
    ...units.map((unit) => ({
      url: `${siteConfig.url}/wiki/units/${unit.slug}`,
      lastModified: new Date(`${unit.lastVerified}T00:00:00Z`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...items.map((item) => ({
      url: `${siteConfig.url}/wiki/gear/${item.slug}`,
      lastModified: new Date(`${item.lastVerified}T00:00:00Z`),
      changeFrequency: "weekly" as const,
      priority: 0.72,
    })),
    ...leaders.map((leader) => ({
      url: `${siteConfig.url}/wiki/leaders/${leader.slug}`,
      lastModified: new Date(`${leader.lastVerified}T00:00:00Z`),
      changeFrequency: "weekly" as const,
      priority: 0.72,
    })),
    ...factions.map((faction) => ({
      url: `${siteConfig.url}/wiki/factions/${faction.slug}`,
      lastModified: new Date("2026-08-20T00:00:00Z"),
      changeFrequency: "weekly" as const,
      priority: 0.76,
    })),
    ...guides.map((guide) => ({
      url: `${siteConfig.url}/guides/${guide.slug}`,
      lastModified: new Date(`${guide.updated}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
  ];
  return entries;
}
