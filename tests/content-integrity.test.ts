import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { pageTdk } from "../src/seo/tdk.js";
import { hasCompleteLeaderCard, hasCompleteUnitCard } from "../src/lib/data/record-coverage.ts";
import { getCompatibleGear, getLeaderCompanyPlan } from "../src/lib/data/editorial-recommendations.ts";
import type { Item, Leader, Unit } from "../src/types/content.ts";

const dataDirectory = path.resolve("src/data/game");
const publicDirectory = path.resolve("public");
const read = <T>(file: string): T => JSON.parse(fs.readFileSync(path.join(dataDirectory, file), "utf8"));

type Slugged = { slug: string };
type Guide = Slugged & { image: string };
type Build = Slugged & { unitSlug: string; leaderSlug: string; placements: { unitSlug: string; itemSlugs: string[] }[] };
type Item = Slugged & { image?: string };

test("game content keeps local media and cross-record references valid", () => {
  const units = read<(Slugged & { image: string })[]>("units.json");
  const items = read<Item[]>("items.json");
  const leaders = read<Slugged[]>("leaders.json");
  const factions = read<(Slugged & { image: string })[]>("factions.json");
  const guides = read<Guide[]>("guides.json");
  const guideDetails = read<Slugged[]>("guide-details.json");
  const builds = read<Build[]>("builds.json");

  for (const entry of [...units, ...items, ...factions, ...guides]) {
    if ("image" in entry && entry.image?.startsWith("/")) {
      assert.ok(fs.existsSync(path.join(publicDirectory, entry.image)), `Missing local image: ${entry.image}`);
    }
  }

  assert.deepEqual(new Set(guides.map((guide) => guide.slug)), new Set(guideDetails.map((guide) => guide.slug)));

  const unitSlugs = new Set(units.map((unit) => unit.slug));
  const itemSlugs = new Set(items.map((item) => item.slug));
  const leaderSlugs = new Set(leaders.map((leader) => leader.slug));
  for (const build of builds) {
    assert.ok(unitSlugs.has(build.unitSlug), `${build.slug} references an unknown featured unit`);
    assert.ok(leaderSlugs.has(build.leaderSlug), `${build.slug} references an unknown leader`);
    for (const placement of build.placements) {
      assert.ok(unitSlugs.has(placement.unitSlug), `${build.slug} has an unknown placed unit`);
      for (const itemSlug of placement.itemSlugs) {
        assert.ok(itemSlugs.has(itemSlug), `${build.slug} has an unknown equipped item`);
      }
    }
  }
});

test("core metadata follows the visible H1 naming convention", () => {
  assert.equal(pageTdk["/"].title, "Goodly Trials - Guide, Units, Gear & Builds");
  assert.equal(pageTdk["/wiki"].title, "Goodly Trials Wiki - Units, Gear & Factions");
  assert.equal(pageTdk["/guides"].title, "Goodly Trials Guides - Tactics, Builds & Game Modes");
  assert.equal(pageTdk["/builder"].title, "Goodly Trials Builder - Plan Your Company");
  assert.equal(pageTdk["/builds"].title, "Goodly Trials Builds - Team Comps & Formations");
});

test("verified base cards qualify for search-facing detail indexing", () => {
  const units = read<(Slugged & { cost?: number; stats: unknown; tactic: { name: string }; source: string })[]>("units.json");
  const leaders = read<(Slugged & { trait: { name: string; effect: string }; source: string })[]>("leaders.json");

  const fullUnits = units.filter(hasCompleteUnitCard);
  const fullLeaders = leaders.filter(hasCompleteLeaderCard);

  assert.equal(fullUnits.length, units.length);
  assert.ok(fullLeaders.length > 0 && fullLeaders.length < leaders.length);
  assert.ok([...units, ...leaders].every((record) => ["goodlytrials.com", "play.goodlytrials.com"].includes(new URL(record.source).hostname)));
});

test("gear comparisons respect current base requirements and slot capacity", () => {
  const units = read<Unit[]>("units.json");
  const items = read<Item[]>("items.json");
  const archer = units.find((unit) => unit.slug === "archer");
  assert.ok(archer);
  assert.ok(!getCompatibleGear(archer, items).some(({ item }) => item.slug === "bow"), "Archer has one Gear slot, so a two-handed bow must not be suggested");
  assert.ok(getCompatibleGear(archer, items).some(({ item }) => item.slug === "feather-charm-of-reflex"));
});

test("leader company frames only link to units that exist", () => {
  const units = read<Unit[]>("units.json");
  const leaders = read<Leader[]>("leaders.json");
  const unitSlugs = new Set(units.map((unit) => unit.slug));
  for (const leader of leaders) {
    for (const slug of getLeaderCompanyPlan(leader, units).unitSlugs) {
      assert.ok(unitSlugs.has(slug), `${leader.slug} company frame references an unknown unit: ${slug}`);
    }
  }
});
