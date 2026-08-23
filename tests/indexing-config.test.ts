import assert from "node:assert/strict";
import test from "node:test";

test("production deployments are indexable without an explicit override", async () => {
  process.env.VERCEL_ENV = "production";
  delete process.env.NEXT_PUBLIC_ALLOW_INDEXING;

  const { siteConfig } = await import("../src/config/site.ts");

  assert.equal(siteConfig.indexable, true);
});
