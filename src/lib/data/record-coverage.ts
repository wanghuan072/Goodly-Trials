import type { Leader, Unit } from "../../types/content";

/** A unit page is complete when its current official base card can be checked. */
export function hasCompleteUnitCard(unit: Pick<Unit, "cost" | "stats" | "tactic">) {
  return unit.cost !== undefined && Boolean(unit.stats) && Boolean(unit.tactic.name);
}

/**
 * Leader records without transcribed trait wording stay available to players,
 * while only complete cards are included in search-facing detail indexing.
 */
export function hasCompleteLeaderCard(leader: Pick<Leader, "trait">) {
  return !leader.trait.effect.includes("has not yet been transcribed");
}
