const previewUrl = "https://goodly-trials-wiki.wanghuan072.chatgpt.site";
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteConfig = {
  name: "Goodly Trials Wiki",
  shortName: "Goodly Trials",
  description: "Verified units, items, mechanics, builds, guides, and patch context for Goodly Trials.",
  url: configuredUrl ?? previewUrl,
  indexable: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  officialUrl: "https://goodlytrials.com/",
  patchNotesUrl: "https://goodlytrials.com/patch-notes",
  playUrl: "https://play.goodlytrials.com/",
  steamUrl: "https://store.steampowered.com/app/4985160/Goodly_Trials/",
  socialImage: "/images/social/goodly-trials-wiki-v0303.png",
  currentVersion: "v0.303",
  lastVerified: "2026-08-20",
  accessStatus: "Open browser beta; Steam lists Early Access for August 18, 2026",
} as const;

export const primaryNavigation = [
  { href: "/", label: "Home" },
  { href: "/wiki", label: "Wiki" },
  { href: "/guides", label: "Guides" },
  { href: "/builder", label: "Builder" },
  { href: "/builds", label: "Builds" },
  { href: "/tier-list", label: "Tier List" },
  { href: "/updates", label: "Updates" },
] as const;

export const wikiNavigation = [
  { href: "/wiki/units", label: "Units" },
  { href: "/wiki/items", label: "Items" },
  { href: "/wiki/leaders", label: "Leaders" },
  { href: "/wiki/mechanics", label: "Mechanics" },
  { href: "/wiki/factions", label: "Factions" },
  { href: "/wiki/traits", label: "Traits" },
  { href: "/wiki/ascendancy", label: "Ascendancy" },
] as const;
