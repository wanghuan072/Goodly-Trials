import { BOARD_CELLS } from "@/lib/builder/board-rules";
import type { Build } from "@/types/content";

export type BuilderPlanSlot = { unitSlug: string; itemSlugs: string[] };
export type BuilderPlanState = { title: string; mode: string; week: number; leaderSlug: string; slots: BuilderPlanSlot[]; notes: string };

export const BUILDER_STORAGE_KEY = "goodly-trials-company-builder-v2";
export const BUILDER_PRESET_KEY = "goodly-trials-company-preset-v1";

export function builderStateFromBuild(build: Build): BuilderPlanState {
  const slots = Array.from({ length: BOARD_CELLS }, () => ({ unitSlug: "", itemSlugs: [] as string[] }));
  build.placements.forEach((placement) => {
    if (placement.slot < 0 || placement.slot >= BOARD_CELLS) return;
    slots[placement.slot] = { unitSlug: placement.unitSlug, itemSlugs: [...placement.itemSlugs] };
  });

  return {
    title: build.title,
    mode: build.mode,
    week: build.week,
    leaderSlug: build.leaderSlug,
    slots,
    notes: `Preset from Builds: ${build.planningNote}`.slice(0, 280),
  };
}
