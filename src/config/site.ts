export const siteConfig = {
  name: "Goodly Trials Wiki",
  shortName: "Goodly Trials",
  description: "Verified units, items, mechanics, builds, guides, and patch context for Goodly Trials.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  officialUrl: "https://goodlytrials.com/",
  steamUrl: "https://store.steampowered.com/app/4985160/Goodly_Trials/",
  currentVersion: "v0.300",
  lastVerified: "2026-08-19",
} as const;

export const primaryNavigation = [
  { href: "/", label: "Home" },
  { href: "/wiki", label: "Wiki" },
  { href: "/guides", label: "Guides" },
  { href: "/builds", label: "Builds" },
  { href: "/tier-list", label: "Tier List" },
  { href: "/updates", label: "Updates" },
] as const;

export const wikiNavigation = [
  { href: "/wiki/units", label: "Units" },
  { href: "/wiki/items", label: "Items" },
  { href: "/wiki/factions", label: "Factions" },
  { href: "/wiki/traits", label: "Traits" },
  { href: "/wiki/ascendancy", label: "Ascendancy" },
  { href: "/wiki/leaders", label: "Leaders" },
  { href: "/wiki/bosses", label: "Bosses" },
  { href: "/wiki/mechanics", label: "Mechanics" },
] as const;
