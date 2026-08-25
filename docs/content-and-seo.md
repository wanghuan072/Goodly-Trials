# Goodly Trials Wiki content and SEO maintenance

## Source policy

The current public site status and patch archive were verified on 2026-08-24 through Goodly Trials v0.312, its mechanics pages, official patch notes, and the Steam application API for app `4985160`.

- Official facts belong in `src/data/game/*.json` and carry `gameVersion`, `lastVerified`, and `source` where the record type supports them.
- Editorial recommendations must be labeled in the rendered page and must link back to the verified unit and item records used to make the recommendation.
- UI references and asset filenames do not prove stats, abilities, release status, or ranking.
- Do not create thin detail pages for roster names that lack an auditable public card.
- State coverage at every database entrance: the site currently contains 50 complete unit cards, 12 item examples, and 49 leader records. Seven leader records have fully transcribed trait text; incomplete leader records remain browsable but are excluded from search-facing detail indexing.
- Keep incomplete encounter indexes such as Bosses out of the sitemap and mark them `noindex` until an auditable roster supports useful standalone pages.

## URL and intent boundaries

- `/wiki/` contains factual data and mechanics.
- `/guides/` answers player questions.
- `/builds/` contains versioned editorial recommendations.
- `/tier-list/` is reserved for a future ranking methodology and is not currently published. Do not create it until versioned placements can be supported without invented data.
- `/updates/` is a curated impact log that paraphrases selected official notes; the official patch page remains the complete source of record.

Unit pages should not target “best build” as their primary intent. Build pages summarize the recommendation immediately and link back to the factual unit and item records.

## Current published scope

- Published hubs: Home, Wiki, Units, Gear, Leaders, Traits, Factions, Guides, Builder, Builds, Updates, About, Search, and legal pages.
- Published detail routes: Units, Gear, Leaders, Factions, and Guides.
- Deferred until auditable content exists: Tier List, Ascendancy, Bosses, standalone Mechanics pages, trait detail routes, build detail routes, and update detail routes.
- The Builder stores drafts locally and can encode an editable draft in a user-initiated share link. Shared drafts are not public database records.

## Deployment and indexing

- Next.js is the only application build path. `npm run build` produces the deployment build used by Vercel.
- Vercel deploys the `main` branch to the canonical production domain; run validation from a clean checkout before publishing.
- Production builds default to indexable. Set `NEXT_PUBLIC_ALLOW_INDEXING=false` explicitly for preview or staging deployments.
- `NEXT_PUBLIC_SITE_URL` must match the public canonical origin used by Metadata, JSON-LD, Sitemap, and robots.txt.
- The site intentionally ships without third-party visitor analytics. If analytics is added later, update the privacy policy and consent behavior in the same change.

## Updating a version

1. Review the official patch note and current mechanics pages.
2. Update affected JSON records and their verification fields.
3. Add a paraphrased update record plus an independent impact note.
4. Recheck linked build notes and tier methodology.
5. Run `npm run verify` and `npm run build`, then inspect sitemap, robots, representative metadata, search, and filters.
