import assert from "node:assert/strict";
import test from "node:test";
import {
  decodeBuilderPlan,
  decodeBuilderPreset,
  emptyBuilderPlan,
  encodeBuilderPlan,
  normalizeBuilderPlan,
  type BuilderPlanCatalog,
} from "../src/lib/builder/plan-state.ts";

const catalog: BuilderPlanCatalog = {
  unitFactionBySlug: new Map([
    ["good-unit", "goodly-folk"],
    ["bone-unit", "bone-host"],
  ]),
  leaderFactionBySlug: new Map([["good-leader", "goodly-folk"]]),
  itemSlugs: new Set(["sword", "unique-axe"]),
  uniqueItemSlugs: new Set(["unique-axe"]),
};

test("builder plan links preserve Unicode content and all board slots", () => {
  const plan = emptyBuilderPlan();
  plan.title = "骨之公司";
  plan.notes = "Front line → hold position";
  plan.week = 8;
  plan.leaderSlug = "good-leader";
  plan.slots[0] = { unitSlug: "good-unit", itemSlugs: ["sword"] };

  assert.deepEqual(decodeBuilderPlan(encodeBuilderPlan(plan)), plan);
});

test("legacy six-slot plans migrate to their original board positions", () => {
  const restored = decodeBuilderPreset(JSON.stringify({
    title: "Legacy",
    mode: "Theorycraft",
    week: 8,
    leaderSlug: "good-leader",
    slots: Array.from({ length: 6 }, (_, index) => ({ unitSlug: `unit-${index}`, itemSlugs: [] })),
    notes: "",
  }));

  assert.ok(restored);
  assert.equal(restored.slots[9].unitSlug, "unit-0");
  assert.equal(restored.slots[21].unitSlug, "unit-5");
});

test("catalog-aware restoration removes invalid followers, gear, and duplicate unique items", () => {
  const plan = emptyBuilderPlan();
  plan.week = 8;
  plan.leaderSlug = "good-leader";
  plan.slots[0] = { unitSlug: "good-unit", itemSlugs: ["unique-axe", "unknown-item"] };
  plan.slots[1] = { unitSlug: "bone-unit", itemSlugs: ["sword"] };
  plan.slots[2] = { unitSlug: "good-unit", itemSlugs: ["unique-axe", "sword", "sword"] };

  const restored = normalizeBuilderPlan(plan, catalog);
  assert.deepEqual(restored.slots[0], { unitSlug: "good-unit", itemSlugs: ["unique-axe"] });
  assert.deepEqual(restored.slots[1], { unitSlug: "", itemSlugs: [] });
  assert.deepEqual(restored.slots[2], { unitSlug: "good-unit", itemSlugs: ["sword"] });
});

test("unknown leaders and malformed payloads fail closed", () => {
  const plan = emptyBuilderPlan();
  plan.week = 8;
  plan.leaderSlug = "retired-leader";
  plan.slots[0] = { unitSlug: "good-unit", itemSlugs: ["sword"] };

  const restored = normalizeBuilderPlan(plan, catalog);
  assert.equal(restored.leaderSlug, "");
  assert.equal(restored.slots.some((slot) => slot.unitSlug), false);
  assert.equal(decodeBuilderPlan("not-base64"), null);
  assert.equal(decodeBuilderPlan("a".repeat(64_001)), null);
});
