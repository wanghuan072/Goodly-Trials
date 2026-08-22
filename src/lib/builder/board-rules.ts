import type { FactionSlug } from "../../types/content";

export const BOARD_COLUMNS = 6;
export const BOARD_ROWS = 6;
export const BOARD_CELLS = BOARD_COLUMNS * BOARD_ROWS;
export const MAX_TRIAL_WEEK = 12;
export const BOARD_RULES_VERSION = "v0.302";
export const BOARD_RULES_CHECKED = "2026-08-20";

const MAX_ACTIVE_COMBATANTS = 17;
const MULTIPLAYER_COMBATANT_CAP = 12;

export const FACTION_FOLLOWER_CAPS: Record<FactionSlug, number> = {
  "goodly-folk": 9,
  "bone-host": 16,
  belowborn: 6,
};

/**
 * Board rules last verified for v0.302 on 2026-08-20 against the official
 * play.goodlytrials.com client bundle. The board starts at 2x3 and alternates
 * adding a column and a row until it reaches 6x6.
 */
export function boardDimensionsForWeek(week: number) {
  const safeWeek = Math.min(MAX_TRIAL_WEEK, Math.max(1, Math.floor(week)));
  let columns = 2;
  let rows = 3;

  for (let completedWeek = 1; completedWeek < safeWeek; completedWeek += 1) {
    if ((completedWeek - 1) % 2 === 0) columns = Math.min(BOARD_COLUMNS, columns + 1);
    else rows = Math.min(BOARD_ROWS, rows + 1);
  }

  return { columns, rows };
}

export function activeBoardCells(week: number) {
  const { columns, rows } = boardDimensionsForWeek(week);
  const firstColumn = BOARD_COLUMNS - columns;
  const firstRow = Math.floor(BOARD_ROWS / 2) - Math.floor(rows / 2);
  const active = new Set<number>();

  for (let row = firstRow; row < firstRow + rows; row += 1) {
    for (let column = firstColumn; column < BOARD_COLUMNS; column += 1) {
      active.add(row * BOARD_COLUMNS + column);
    }
  }

  return active;
}

export function followerLimitForRules(week: number, mode: string, faction?: FactionSlug) {
  if (!faction) return 0;
  const { columns, rows } = boardDimensionsForWeek(week);
  const activeCombatantLimit = Math.min(columns * rows, MAX_ACTIVE_COMBATANTS);
  const companyCombatantLimit = mode === "Multiplayer"
    ? MULTIPLAYER_COMBATANT_CAP
    : FACTION_FOLLOWER_CAPS[faction] + 1;

  // The Builder keeps the leader in its own dock; the live game counts it as
  // one occupied combatant, so the follower allowance is one lower.
  return Math.max(0, Math.min(activeCombatantLimit, companyCombatantLimit) - 1);
}

export function followerCapLabel(mode: string, faction?: FactionSlug) {
  if (!faction) return "Assign a leader to set the company cap";
  if (mode === "Multiplayer") return "Mixed multiplayer · 11 followers + 1 leader";
  return `${FACTION_FOLLOWER_CAPS[faction]} followers + 1 leader`;
}
