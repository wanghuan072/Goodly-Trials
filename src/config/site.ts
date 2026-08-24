export const siteConfig = {
  name: "Goodly Trials Wiki",
  shortName: "Goodly Trials",
  description: "Plan a Goodly Trials run with documented unit cards, gear effects, editable formations, player guides, build ideas, and versioned patch changes in one practical player reference.",
  url: "https://goodlytrials.org",
  indexable:
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  officialUrl: "https://goodlytrials.com/",
  patchNotesUrl: "https://goodlytrials.com/patch-notes",
  playUrl: "https://play.goodlytrials.com/",
  steamUrl: "https://store.steampowered.com/app/4985160/Goodly_Trials/",
  socialImage: "/images/og-image.png",
  latestPatchVersion: "v0.311",
  lastVerified: "2026-08-24",
  accessStatus: "Check the official site and Steam listing for current access and platform availability.",
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
