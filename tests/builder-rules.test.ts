import assert from "node:assert/strict";
import test from "node:test";
import {
  activeBoardCells,
  BOARD_CELLS,
  boardDimensionsForWeek,
  followerCapLabel,
  followerLimitForRules,
} from "../src/lib/builder/board-rules.ts";
import { itemKind, itemSlotUse } from "../src/lib/builder/equipment-rules.ts";

test("board growth starts at 2×3, alternates growth, and caps at 6×6", () => {
  assert.deepEqual(boardDimensionsForWeek(1), { columns: 2, rows: 3 });
  assert.deepEqual(boardDimensionsForWeek(2), { columns: 3, rows: 3 });
  assert.deepEqual(boardDimensionsForWeek(3), { columns: 3, rows: 4 });
  assert.deepEqual(boardDimensionsForWeek(4), { columns: 4, rows: 4 });
  assert.deepEqual(boardDimensionsForWeek(8), { columns: 6, rows: 6 });
  assert.deepEqual(boardDimensionsForWeek(0), { columns: 2, rows: 3 });
  assert.deepEqual(boardDimensionsForWeek(99), { columns: 6, rows: 6 });
});

test("active board cells match the documented board dimensions", () => {
  assert.deepEqual([...activeBoardCells(1)], [16, 17, 22, 23, 28, 29]);
  assert.equal(activeBoardCells(4).size, 16);
  assert.equal(activeBoardCells(8).size, BOARD_CELLS);
  assert.deepEqual([...activeBoardCells(8)].toSorted((a, b) => a - b), Array.from({ length: BOARD_CELLS }, (_, index) => index));
});

test("follower limits respect board size, faction caps, and multiplayer rules", () => {
  assert.equal(followerLimitForRules(1, "Theorycraft"), 0);
  assert.equal(followerLimitForRules(1, "Theorycraft", "goodly-folk"), 5);
  assert.equal(followerLimitForRules(8, "Theorycraft", "goodly-folk"), 9);
  assert.equal(followerLimitForRules(8, "Theorycraft", "bone-host"), 16);
  assert.equal(followerLimitForRules(8, "Theorycraft", "belowborn"), 6);
  assert.equal(followerLimitForRules(8, "Multiplayer", "goodly-folk"), 11);
  assert.equal(followerCapLabel("Multiplayer", "bone-host"), "Mixed multiplayer · 11 followers + 1 leader");
});

test("equipment slot rules distinguish consumables, trinket-slot items, and hand gear", () => {
  assert.deepEqual(itemSlotUse({ type: "Potion" }), { gear: 0, trinkets: 0 });
  assert.deepEqual(itemSlotUse({ type: "Spell" }), { gear: 0, trinkets: 1 });
  assert.deepEqual(itemSlotUse({ type: "Trinket" }), { gear: 0, trinkets: 1 });
  assert.deepEqual(itemSlotUse({ type: "One-handed" }), { gear: 1, trinkets: 0 });
  assert.deepEqual(itemSlotUse({ type: "Two-handed · Unique" }), { gear: 2, trinkets: 0 });
  assert.equal(itemKind({ type: "Potion" }), "consumable");
  assert.equal(itemKind({ type: "Spell" }), "trinkets");
  assert.equal(itemKind({ type: "Gear" }), "gear");
});
