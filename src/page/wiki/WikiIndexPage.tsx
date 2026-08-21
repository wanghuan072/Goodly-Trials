import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/seo/JsonLd";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { factions, items, leaders, units, updates } from "@/lib/data/game-content";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/wiki/wiki-hub.module.css";

export const metadata = createMetadata(
  "Goodly Trials Wiki – Units, Items, Stats & Formation",
  "Browse verified Goodly Trials records by category, then open individual entries for unit stats, item effects, mechanics, factions, and patch context.",
  "/wiki",
);

const archiveSections = [
  { icon: "♜", title: "Units", href: "/wiki/units", count: `${units.length} verified records`, description: "Search the roster, compare core stats, then open a card for skills, tactic, equipment notes, and patch history.", label: "Roster" },
  { icon: "⚔", title: "Items", href: "/wiki/items", count: `${items.length} verified records`, description: "Filter weapons, shields, trinkets, spells, and potions before opening the exact requirements, price, and effects.", label: "Equipment" },
  { icon: "♛", title: "Leaders", href: "/wiki/leaders", count: `${leaders.length} featured cards`, description: "Read the public leader-card sample and keep those versioned values distinct from unverified loadouts.", label: "Leaders" },
  { icon: "⌘", title: "Mechanics", href: "/wiki/mechanics", count: "4 explainers", description: "Open a guide for stats, formation, flanking, game modes, and the broader journey loop.", label: "Systems" },
  { icon: "✦", title: "Traits", href: "/wiki/traits", count: `${units.length} sourced traits`, description: "Trait effects are indexed from the public unit cards and always link back to the unit that carries them.", label: "Reference" },
  { icon: "◈", title: "Factions", href: "/wiki/factions", count: `${factions.length} public factions`, description: "Explore faction identity, visible roster names, and the records that have enough data for a dedicated page.", label: "Reference" },
  { icon: "✥", title: "Ascendancy", href: "/wiki/ascendancy", count: "Verified examples", description: "Review public examples of Power, Fortitude, and Authority without treating incomplete records as a tier list.", label: "Progression" },
];

export default function WikiIndexPage() {
  const recentEntries = updates.slice(0, 3);

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Goodly Trials Wiki",
        description: "A source-conscious archive of Goodly Trials units, items, leaders, mechanics, factions, and update records.",
        url: `${siteConfig.url}/wiki`,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        mainEntity: { "@type": "ItemList", numberOfItems: archiveSections.length, itemListElement: archiveSections.map((section, index) => ({ "@type": "ListItem", position: index + 1, name: section.title, url: `${siteConfig.url}${section.href}` })) },
      }} />

      <section className={styles.hero}>
        <Image className={styles.heroImage} src="/images/game/screenshot-5.webp" alt="Goodly Trials combat log and unit stat interface" fill sizes="100vw" priority />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroInner}`}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki" }]} />
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Official-source archive · current public build {siteConfig.currentVersion}</p>
            <h1>Goodly Trials Wiki</h1>
            <p>Start in a category, scan a focused list, then open the record you need. Every entry separates verified facts from editorial guidance.</p>
          </div>
          <dl className={styles.heroStats}>
            <div><dt>Unit records</dt><dd>{units.length}</dd></div>
            <div><dt>Item records</dt><dd>{items.length}</dd></div>
            <div><dt>Leader cards</dt><dd>{leaders.length}</dd></div>
            <div><dt>Factions</dt><dd>{factions.length}</dd></div>
          </dl>
        </div>
      </section>

      <section className={`container section ${styles.archiveLayout}`}>
        <aside className={styles.archiveNav} aria-label="Wiki categories">
          <p className={styles.navLabel}>Archive index</p>
          <Link className={styles.activeNav} href="/wiki"><span>⌂</span> Overview</Link>
          <Link href="/wiki/list"><span>☷</span> Wiki list<small>All verified records</small></Link>
          {archiveSections.map((section) => <Link href={section.href} key={section.href}><span>{section.icon}</span>{section.title}<small>{section.count}</small></Link>)}
          <div className={styles.navDivider} />
          <p className={styles.navLabel}>Player tools</p>
          <Link href="/builder"><span>▦</span> Company Builder</Link>
          <Link href="/builds"><span>♟</span> Example Builds</Link>
          <Link href="/guides"><span>?</span> Player Guides</Link>
        </aside>

        <div className={styles.archiveContent}>
          <div className={styles.archiveStatus}>
            <span>LIVE</span>
            <p><b>{siteConfig.currentVersion} public reference</b><br />Last checked {siteConfig.lastVerified}. Counts describe the auditable sample, not an assumed full game database.</p>
            <Link href="/wiki/list">All records →</Link>
          </div>

          <form className={styles.search} action="/search" role="search">
            <label htmlFor="wiki-search">Search the archive</label>
            <div><span aria-hidden="true">⌕</span><input id="wiki-search" name="q" type="search" placeholder="Search a unit, item, trait, stat, or guide…" /><button type="submit">Search</button></div>
          </form>

          <header className={styles.sectionHeader}>
            <div><p>Browse the archive</p><h2>Choose a record type</h2></div>
            <span>List first · detail when needed</span>
          </header>
          <div className={styles.archiveList}>
            {archiveSections.map((section) => <Link className={styles.archiveRow} href={section.href} key={section.href}>
              <span className={styles.rowIcon}>{section.icon}</span>
              <div><small>{section.label} · {section.count}</small><h3>{section.title}</h3><p>{section.description}</p></div>
              <b>Open list →</b>
            </Link>)}
          </div>

          <section className={styles.pendingRecord}>
            <span aria-hidden="true">☠</span>
            <div><small>DATA PENDING · NOT A COMPLETE DATABASE</small><h2>Boss encounters</h2><p>Public material confirms bosses and progression unlocks, but does not provide a complete current roster for individual pages. We preserve that gap instead of filling it with guessed entries.</p></div>
            <Link href="/wiki/bosses">Verified status →</Link>
          </section>

          <section className={styles.latestSection}>
            <header className={styles.sectionHeader}><div><p>Patch context</p><h2>Recently verified</h2></div><Link href="/updates">All updates →</Link></header>
            <div className={styles.latestList}>{recentEntries.map((entry) => <Link href={`/updates/${entry.slug}`} key={entry.slug}><time>{entry.date}</time><div><small>{entry.type} · {entry.version}</small><h3>{entry.title}</h3><p>{entry.summary}</p></div><b>Read →</b></Link>)}</div>
          </section>
        </div>
      </section>
    </main>
  );
}
