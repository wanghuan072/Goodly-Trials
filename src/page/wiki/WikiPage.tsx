import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/seo/JsonLd";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { factions, items, leaders, units, updates } from "@/lib/data/game-content";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata(
  "Goodly Trials Wiki – Units, Items, Stats & Formation",
  "Search verified Goodly Trials unit cards, items, leaders, stats, formation rules, factions, patch notes, and the interactive company builder.",
  "/wiki",
);

const primaryTopics = [
  { symbol: "♜", title: "Units", href: "/wiki/units", count: `${units.length} complete public cards`, copy: "Compare core stats, traits, skills, tactics, equipment slots, and source versions." },
  { symbol: "⚔", title: "Items", href: "/wiki/items", count: `${items.length} public examples`, copy: "Search weapons, shields, trinkets, spells, and potions by requirement, effect, and price." },
  { symbol: "♛", title: "Leaders", href: "/wiki/leaders", count: `${leaders.length} featured cards`, copy: "Review publicly visible leader starts without inventing hidden kits or rankings." },
  { symbol: "⌘", title: "Mechanics", href: "/wiki/mechanics", count: "4 verified explainers", copy: "Learn stats, formation, flanking, game modes, and the twelve-trial journey." },
];

const playerPaths = [
  { step: "01", title: "How do I start?", href: "/guides/beginners-guide", copy: "Follow the Shop → Place → Equip → Battle loop and understand how a journey ends." },
  { step: "02", title: "What do the stats mean?", href: "/wiki/mechanics/stats", copy: "Read HP, ES, MP, STR, AGI, INT, ATK, CRT, RNG, SPD, AR, and EVA." },
  { step: "03", title: "Where should units go?", href: "/wiki/mechanics/formation", copy: "Plan around tactics, range, adjacency, frontlines, backlines, and the opposing board." },
  { step: "04", title: "How does flanking work?", href: "/wiki/mechanics/flanking", copy: "Check rear entry, exposed targets, survivability, and why a flank is never guaranteed." },
  { step: "05", title: "Can I plan a company?", href: "/builder", copy: "Drag verified units and equipment onto a game-shaped board, then continue from a preset build." },
];

const referenceTopics = [
  { title: "Factions", href: "/wiki/factions", meta: `${factions.length} public factions`, copy: "Goodly Folk, Bone Host, and Belowborn identities with full-card coverage clearly marked." },
  { title: "Traits", href: "/wiki/traits", meta: `${units.length} public-card traits`, copy: "Exact effects from the currently auditable unit sample, linked back to their source cards." },
  { title: "Ascendancy", href: "/wiki/ascendancy", meta: "Verified examples", copy: "Power, Fortitude, and Authority examples without pretending they form a universal tier list." },
];

export default function WikiPage() {
  const recentEntries = [
    ...updates.slice(0, 3).map((update) => ({ meta: `${update.date} · ${update.type}`, title: `${update.version} · ${update.title}`, copy: update.summary, href: `/updates/${update.slug}`, tag: "Impact" })),
    ...units.slice(0, 2).map((unit) => ({ meta: unit.faction, title: unit.name, copy: unit.summary, href: `/wiki/units/${unit.slug}`, tag: unit.gameVersion })),
  ];

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Goodly Trials Wiki",
        description: "A source-conscious collection of Goodly Trials units, items, leaders, mechanics, guides, and patch context.",
        url: `${siteConfig.url}/wiki`,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: primaryTopics.length,
          itemListElement: primaryTopics.map((topic, index) => ({ "@type": "ListItem", position: index + 1, name: topic.title, url: `${siteConfig.url}${topic.href}` })),
        },
      }} />

      <section className={styles.hero}>
        <Image className={styles.heroImage} src="/images/game/screenshot-5.webp" alt="Goodly Trials combat log and unit stat interface" fill sizes="100vw" />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki" }]} />
          <p className={styles.eyebrow}>Player reference · current public build {siteConfig.currentVersion}</p>
          <h1>Goodly Trials Wiki</h1>
          <p>Find the answer behind your next shop, placement, or equipment decision. Complete records are separated from public samples and data still waiting for verification.</p>
        </div>
      </section>

      <section className={`container section ${styles.wikiShell}`}>
        <div className={styles.wikiStatus}>
          <span className={styles.wikiStatusMark}>LIVE</span>
          <div>
            <b>Open browser beta · official patch {siteConfig.currentVersion}</b>
            <p>Patch notes and public mechanics were checked on {siteConfig.lastVerified}. Unit and item examples below describe the publicly auditable sample, not the game&apos;s complete roster.</p>
          </div>
          <div className={styles.wikiStatusActions}>
            <a href={siteConfig.playUrl} target="_blank" rel="noreferrer">Play official beta ↗</a>
            <Link href="/updates">Latest patch</Link>
          </div>
        </div>

        <form className={styles.wikiSearch} action="/search" role="search">
          <label htmlFor="wiki-search">Search the verified archive</label>
          <div><span aria-hidden="true">⌕</span><input id="wiki-search" name="q" type="search" placeholder="Search a unit, item, trait, stat, or guide…" /><button type="submit">Search Wiki</button></div>
          <p>Try: <Link href="/wiki/units/goodly-knight">Goodly Knight</Link> · <Link href="/wiki/items/frostfall-of-lore">Frostfall</Link> · <Link href="/wiki/mechanics/flanking">Flanking</Link></p>
        </form>

        <section aria-labelledby="start-here">
          <div className={styles.wikiSectionHeader}><div><p>Start with a decision</p><h2 id="start-here">What are you trying to understand?</h2></div><Link href="/guides">All player guides →</Link></div>
          <div className={styles.wikiQuickGrid}>{playerPaths.map((path) => <Link className={styles.wikiQuickCard} href={path.href} key={path.href}><span>{path.step}</span><div><h3>{path.title}</h3><p>{path.copy}</p></div><b>Open →</b></Link>)}</div>
        </section>

        <section aria-labelledby="verified-database">
          <div className={styles.wikiSectionHeader}><div><p>Verified database</p><h2 id="verified-database">Browse complete public records</h2></div><span>Facts first · editorial notes labeled</span></div>
          <div className={styles.portalGrid}>{primaryTopics.map((topic) => <Link className={styles.portalCard} href={topic.href} key={topic.href}><span aria-hidden="true">{topic.symbol}</span><small>{topic.count}</small><h2>{topic.title}</h2><p>{topic.copy}</p><b>Browse {topic.title} →</b></Link>)}</div>
        </section>

        <section className={styles.wikiCoverage} aria-labelledby="coverage-title">
          <div className={styles.wikiSectionHeader}><div><p>Coverage, not guesswork</p><h2 id="coverage-title">Know what the archive can prove</h2></div><Link href="/about">Read the source policy →</Link></div>
          <div className={styles.wikiCoverageGrid}>
            <div><strong>{units.length}</strong><span>complete public unit cards</span><p>Stats, traits, skills, tactics, and sources are available.</p></div>
            <div><strong>{items.length}</strong><span>public item examples</span><p>Requirements, prices, effects, and equipment types are searchable.</p></div>
            <div><strong>{leaders.length}</strong><span>featured leader cards</span><p>Versioned values remain separate from later unverified leader kits.</p></div>
            <div><strong>{factions.length}</strong><span>public factions</span><p>Roster names do not become detail pages until full cards can be checked.</p></div>
          </div>
        </section>

        <section aria-labelledby="reference-title">
          <div className={styles.wikiSectionHeader}><div><p>Supporting reference</p><h2 id="reference-title">Explore verified context</h2></div></div>
          <div className={styles.secondaryPortalGrid}>{referenceTopics.map((topic) => <Link className={styles.secondaryPortalCard} href={topic.href} key={topic.href}><small>{topic.meta}</small><h3>{topic.title}</h3><p>{topic.copy}</p><b>Open reference →</b></Link>)}</div>
          <div className={styles.pendingPanel}><span aria-hidden="true">☠</span><div><small>DATA PENDING · NOT A COMPLETE DATABASE</small><h3>Boss encounters</h3><p>Official material confirms multiple bosses and progression unlocks, but a current auditable boss roster is not yet public. The status page records only what can be verified.</p></div><Link href="/wiki/bosses">View verified status →</Link></div>
        </section>

        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <div className={styles.wikiSectionHeader}><div><p>Recently verified</p><h2>Fresh archive entries</h2></div><Link href="/updates">All update notes →</Link></div>
            <div className={styles.entryList}>{recentEntries.map((entry) => <Link className={styles.entryRow} href={entry.href} key={entry.href}><span>{entry.meta}</span><div><h3>{entry.title}</h3><p>{entry.copy}</p></div><b>{entry.tag} →</b></Link>)}</div>
          </div>
          <aside className={styles.sidebar}>
            <h2>Archive rules</h2>
            <p className={styles.sourceBox}><strong>Facts are sourced.</strong><br />Recommendations are labeled editorial. Missing data stays missing instead of being replaced with plausible game-like copy.</p>
            <h3>Popular tasks</h3>
            <Link href="/guides/beginners-guide">How to play</Link>
            <Link href="/wiki/mechanics/stats">Stats explained</Link>
            <Link href="/wiki/mechanics/formation">Formation guide</Link>
            <Link href="/wiki/mechanics/modes">Single-player, Ranked & multiplayer</Link>
            <Link href="/builder">Open company builder</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
