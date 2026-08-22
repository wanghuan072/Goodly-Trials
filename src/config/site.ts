export const siteConfig = {
  name: "Goodly Trials Wiki",
  shortName: "Goodly Trials",
  description: "Plan a Goodly Trials run with current unit cards, gear effects, editable formations, player guides, build ideas, and versioned patch changes in one practical.",
  url: "https://goodlytrials.org",
  indexable: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  officialUrl: "https://goodlytrials.com/",
  patchNotesUrl: "https://goodlytrials.com/patch-notes",
  playUrl: "https://play.goodlytrials.com/",
  steamUrl: "https://store.steampowered.com/app/4985160/Goodly_Trials/",
  socialImage: "/images/og-image.png",
  latestPatchVersion: "v0.307",
  lastVerified: "2026-08-21",
  accessStatus: "Open browser beta; Steam lists Early Access for August 18, 2026",
} as const;

export const primaryNavigation = [
  { href: "/", label: "Home" },
  { href: "/wiki", label: "Wiki" },
  { href: "/guides", label: "Guides" },
  { href: "/builder", label: "Builder" },
  { href: "/builds", label: "Builds" },
  { href: "/updates", label: "Updates" },
] as const;

export const wikiNavigation = [
  { href: "/wiki/units", label: "Units" },
  { href: "/wiki/gear", label: "Gear" },
  { href: "/wiki/leaders", label: "Leaders" },
  { href: "/wiki/traits", label: "Traits" },
  { href: "/wiki/factions", label: "Factions" },
] as const;
