# Goodly Trials Wiki

[Goodly Trials Wiki](https://goodlytrials.org) is an independent, fan-made player guide for **Goodly Trials**. It brings public unit cards, gear effects, leaders, traits, factions, editable board plans, and selected patch changes into one place for players who want to think through a company before a run.

Goodly Trials is a turn-based strategy game about hiring an unusual company, arranging the line, choosing equipment, and adapting to the board in front of you. A strong plan is not only about a single card: placement, range, adjacent allies, gear requirements, traits, and patch changes can all matter.

This site is not affiliated with, endorsed by, or operated by the developer or publisher of Goodly Trials. Official game pages and patch notes remain the authority for live-game information.

## What You Can Find Here

- Public unit cards with stats, traits, tactics, skills, slots, and connected pages.
- Gear pages for weapons, shields, trinkets, spells, and potions, including published effects and requirement or cost status where available.
- Leader, faction, and trait pages that link related records together rather than treating every card in isolation.
- An interactive Builder for placing a company, moving gear, and testing a formation before you play.
- Editable build ideas that explain their strengths and tradeoffs instead of presenting a single guaranteed “best” answer.
- Guides for early shop choices, board positioning, tactics, progression, and game modes.
- Selected update notes that identify changes with practical consequences for cards and builds.

## Site Navigation

- [Home](https://goodlytrials.org/) — Start with the latest public coverage, useful entry points, and a quick explanation of the site.
- [Wiki](https://goodlytrials.org/wiki) — Browse the complete player reference hub.
- [Units](https://goodlytrials.org/wiki/units) — Compare currently documented units, their stats, tactics, traits, and skills.
- [Gear](https://goodlytrials.org/wiki/gear) — Check item effects, requirements, prices when published, and related unit pages.
- [Leaders](https://goodlytrials.org/wiki/leaders) — Review public leader starting stats, slots, traits, and faction context.
- [Traits](https://goodlytrials.org/wiki/traits) — Find a trait and follow it back to the unit card that uses it.
- [Factions](https://goodlytrials.org/wiki/factions) — See public roster names and the broad board themes associated with each faction.
- [Guides](https://goodlytrials.org/guides) — Read player-focused explanations for common decisions.
- [Builder](https://goodlytrials.org/builder) — Assemble a formation, assign gear, and adjust the layout interactively.
- [Builds](https://goodlytrials.org/builds) — Open an editable team idea in the Builder and adapt it to your own board.
- [Updates](https://goodlytrials.org/updates) — Read selected patch changes and why they may matter to a run.
- [About](https://goodlytrials.org/about) — Learn how the site handles public information, version notes, and player interpretation.

## How to Use the Builder

1. Open the [Builder](https://goodlytrials.org/builder) and choose a public unit or leader card from the roster.
2. Drag a unit into an available board slot. The board follows the currently documented placement limits rather than allowing an unlimited company.
3. Drag suitable gear, trinkets, spells, or consumables onto a placed unit. The Builder shows known slot use and highlights a conflict when the public data supports one.
4. Move cards to test adjacency, a frontline, a backline, or a flank. Read the linked unit card before assuming a tactic guarantees a result.
5. Copy the planning link or open a [Build](https://goodlytrials.org/builds) as a starting point, then change it for the run you are actually playing. A shared link contains an editable draft; it does not publish the build to the site.

## Data and Version Notes

Goodly Trials changes during development. Every effort is made to label a record with the game version or check date that supports it. If a public source does not publish a price, slot type, stat, or full card, the site should say that the information is not published instead of guessing.

Build descriptions and editorial notes are player context, not official recommendations. They are intended to make a decision easier to inspect, not to promise a win or replace the current game client.

## Frequently Asked Questions

### Is this the official Goodly Trials website?

No. This is a fan-made player resource. Use the [official Goodly Trials website](https://goodlytrials.com/) and [official patch notes](https://goodlytrials.com/patch-notes) for live-game announcements and authoritative information.

### Why does an item or card say “not published”?

The public source may confirm that an item or mechanic exists without exposing every value. Leaving the field unfilled is more useful than presenting an invented number as game data.

### Are the builds guaranteed to work?

No. Builds are editable planning examples. Board state, patch version, available gear, and opposing units can change the outcome of a run.

### How can I report an incorrect page or broken link?

Email [wyong@goodlytrials.org](mailto:wyong@goodlytrials.org) with the page URL, the field that needs correction, and an official public source when possible. For more detail, read the [Contact Us page](https://goodlytrials.org/legal/contact-us).

## Legal

- [Privacy Policy](https://goodlytrials.org/legal/privacy-policy)
- [Terms of Service](https://goodlytrials.org/legal/terms-of-service)
- [Copyright Notice](https://goodlytrials.org/legal/copyright)
- [About Us](https://goodlytrials.org/legal/about-us)
- [Contact Us](https://goodlytrials.org/legal/contact-us)

Copyright © 2026 Goodly Trials Wiki. All rights reserved. Goodly Trials Wiki is an independent fan site and is not affiliated with the official Goodly Trials website or its rights holders.

## Development

- `npm run dev` starts the Sites/vinext development server.
- `npm run verify` runs data and rules tests, ESLint, route type generation, and TypeScript.
- `npm run build` creates the Sites production build and leaves compatible generated route types behind.
- `npm run build:next` verifies the optional native Next.js/Vercel production path.

Copy `.env.example` only as a starting point. Keep `NEXT_PUBLIC_ALLOW_INDEXING=true` for the canonical production domain and set it to `false` for preview or staging deployments.
