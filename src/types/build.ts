export type Build = {
  slug: string;
  title: string;
  unitSlug: string;
  faction: string;
  difficulty: string;
  version: string;
  summary: string;
  mode: "Theorycraft" | "Single-player" | "Ranked" | "Multiplayer";
  week: number;
  leaderSlug: string;
  bestFor: string;
  strengths: string[];
  weaknesses: string[];
  planningNote: string;
  placements: { slot: number; unitSlug: string; itemSlugs: string[] }[];
};
