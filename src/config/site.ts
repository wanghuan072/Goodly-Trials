type SiteEnvironment = Partial<Pick<
  NodeJS.ProcessEnv,
  "NEXT_PUBLIC_ALLOW_INDEXING" | "NEXT_PUBLIC_SITE_URL" | "NODE_ENV" | "VERCEL_ENV"
>>;

const DEFAULT_SITE_URL = "https://goodlytrials.org";

export function resolveSiteUrl(environment: SiteEnvironment = process.env) {
  const configuredUrl = environment.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredUrl) return DEFAULT_SITE_URL;

  try {
    return new URL(configuredUrl).toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function resolveIndexability(environment: SiteEnvironment = process.env) {
  const override = environment.NEXT_PUBLIC_ALLOW_INDEXING;
  if (override === "true") return true;
  if (override === "false") return false;

  return environment.VERCEL_ENV === "production" || environment.NODE_ENV === "production";
}

export const siteConfig = {
  name: "Goodly Trials Wiki",
  shortName: "Goodly Trials",
  description: "Plan a Goodly Trials run with documented unit cards, gear effects, editable formations, player guides, build ideas, and versioned patch changes in one practical player reference.",
  url: resolveSiteUrl(),
  indexable: resolveIndexability(),
  officialUrl: "https://goodlytrials.com/",
  patchNotesUrl: "https://goodlytrials.com/patch-notes",
  playUrl: "https://play.goodlytrials.com/",
  steamUrl: "https://store.steampowered.com/app/4985160/Goodly_Trials/",
  socialImage: "/images/og-image.png",
  latestPatchVersion: "v0.312",
  lastVerified: "2026-08-24",
  accessStatus: "Check the official site and Steam listing for current access and platform availability.",
} as const;
