/**
 * The live client supplies named battle sprites for its published leader
 * records. A small number of local records do not yet have a matching public
 * sprite in the current client, so only those fall back to their base unit.
 */
const portraitUnavailable = new Set([
  "skeleton-mage-perceptive",
  "skeleton-mage-fettle",
]);

const directBattleSprites: Record<string, string> = {
  aldric: "goodly_knight",
  hobb: "portly_knight",
  ivo: "wizard",
  "young-keth": "skeleton_knight",
  "arrowheaded-gerry": "dwarf_stoneworker",
};

const battleSpritePrefixes: ReadonlyArray<readonly [string, string]> = [
  ["goodly-knight-", "goodly_knight"],
  ["portly-knight-", "portly_knight"],
  ["old-man-", "old_man"],
  ["banneret-captain-", "banneret_captain"],
  ["scout-", "scout"],
  ["archer-", "archer"],
  ["wizard-", "wizard"],
  ["goodly-nurse-", "goodly_nurse"],
  ["saint-many-hands-", "saint_many_hands"],
  ["skeleton-knight-", "skeleton_knight"],
  ["skeleton-child-", "skeleton_child"],
  ["skeleton-dog-", "skeleton_dog"],
  ["skeleton-mage-", "skeleton_mage"],
  ["skeleton-horror-", "skeleton_horror"],
  ["tunnel-defender-", "dwarf_stoneworker"],
  ["dwarf-messenger-", "dwarf_messenger"],
  ["dwarf-knower-", "dwarf_knower"],
];

export function leaderImage(slug: string) {
  if (!portraitUnavailable.has(slug)) return `/images/leaders/${slug}.png`;
  const sprite = directBattleSprites[slug] ?? battleSpritePrefixes.find(([prefix]) => slug.startsWith(prefix))?.[1];
  return sprite ? `/images/units/official/${sprite}.png` : undefined;
}
