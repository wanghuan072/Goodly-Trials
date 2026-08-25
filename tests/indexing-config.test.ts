import assert from "node:assert/strict";
import test from "node:test";
import { resolveIndexability, resolveSiteUrl } from "../src/config/site.ts";

test("production deployments are indexable without relying on a Vercel-only flag", () => {
  assert.equal(resolveIndexability({ NODE_ENV: "production" }), true);
  assert.equal(resolveIndexability({ VERCEL_ENV: "production" }), true);
});

test("an explicit indexing override wins for preview and production builds", () => {
  assert.equal(resolveIndexability({ NODE_ENV: "production", NEXT_PUBLIC_ALLOW_INDEXING: "false" }), false);
  assert.equal(resolveIndexability({ NODE_ENV: "development", NEXT_PUBLIC_ALLOW_INDEXING: "true" }), true);
});

test("site URL configuration accepts a valid origin and rejects malformed input", () => {
  assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://preview.example.com/" }), "https://preview.example.com");
  assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "not a URL" }), "https://goodlytrials.org");
});
