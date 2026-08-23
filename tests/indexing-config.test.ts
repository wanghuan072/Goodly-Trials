import assert from "node:assert/strict";
import test from "node:test";

test("production deployments stay indexable when the generic env default is false", async () => {
  process.env.VERCEL_ENV = "production";
  process.env.NEXT_PUBLIC_ALLOW_INDEXING = "false";

  const { siteConfig } = await import("../src/config/site.ts");

  assert.equal(siteConfig.indexable, true);
});
