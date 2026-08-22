# Goodly Trials Wiki content and SEO maintenance

## Source policy

The current public site status and patch archive were verified on 2026-08-20 against Goodly Trials v0.303, its mechanics pages, official patch notes, and the Steam application API for app `4985160`.

- Official facts belong in `src/data/game/*.json` and carry `gameVersion`, `lastVerified`, and `source` where the record type supports them.
- Editorial recommendations must be labeled in the rendered page and must link back to the verified unit and item records used to make the recommendation.
- UI references and asset filenames do not prove stats, abilities, release status, or ranking.
- Do not create thin detail pages for roster names that lack an auditable public card.
- State coverage at every database entrance: the current public source exposes six complete unit examples and twelve item examples, while the Steam description says the game contains a much larger playable roster.
- Keep incomplete encounter indexes such as Bosses out of the sitemap and mark them `noindex` until an auditable roster supports useful standalone pages.

## URL and intent boundaries

- `/wiki/` contains factual data and mechanics.
- `/guides/` answers player questions.
- `/builds/` contains versioned editorial recommendations.
- `/tier-list/` owns ranking methodology and future placements.
- `/updates/` is a curated impact log that paraphrases selected official notes; the official patch page remains the complete source of record.

Unit pages should not target “best build” as their primary intent. Build pages summarize the recommendation immediately and link back to the factual unit and item records.

## Updating a version

1. Review the official patch note and current mechanics pages.
2. Update affected JSON records and their verification fields.
3. Add a paraphrased update record plus an independent impact note.
4. Recheck linked build notes and tier methodology.
5. Run lint and a production build, then inspect sitemap, robots, representative metadata, search, and filters.
