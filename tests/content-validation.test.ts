import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { assertGameContent } from "../src/lib/data/validate-game-content.ts";

const dataDirectory = path.resolve("src/data/game");
const read = (file: string): unknown => JSON.parse(fs.readFileSync(path.join(dataDirectory, file), "utf8"));

function loadContent() {
  return {
    units: read("units.json"),
    items: read("items.json"),
    leaders: read("leaders.json"),
    factions: read("factions.json"),
    guides: read("guides.json"),
    builds: read("builds.json"),
    updates: read("updates.json"),
  };
}

test("all shipped game JSON passes the runtime content contract", () => {
  assert.doesNotThrow(() => assertGameContent(loadContent()));
});

test("content validation rejects duplicate records and broken build references", () => {
  const duplicateContent = loadContent();
  assert.ok(Array.isArray(duplicateContent.units));
  duplicateContent.units.push(structuredClone(duplicateContent.units[0]));
  assert.throws(() => assertGameContent(duplicateContent), /duplicate slugs/);

  const brokenReferenceContent = loadContent();
  assert.ok(Array.isArray(brokenReferenceContent.builds));
  const firstBuild = brokenReferenceContent.builds[0];
  assert.ok(firstBuild && typeof firstBuild === "object");
  (firstBuild as Record<string, unknown>).unitSlug = "missing-unit";
  assert.throws(() => assertGameContent(brokenReferenceContent), /references an unknown unit/);
});
