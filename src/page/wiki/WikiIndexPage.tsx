import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/seo/JsonLd";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import {
  factions,
  items,
  leaders,
  units,
  updates,
} from "@/lib/data/game-content";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/wiki/wiki-hub.module.css";

export const metadata = createMetadata(
  "Goodly Trials Wiki – Units, Gear, Leaders & Factions",
  "Explore Goodly Trials units, gear, leaders, traits, factions, and patch changes. Check the details you need before a run.",
  "/wiki",
);

const archiveSections = [
  {
    icon: "U",
    title: "Units",
    href: "/wiki/units",
    count: `${units.length} unit cards`,
    description:
      "Compare stats, skills, tactics, and equipment capacity before deciding where a unit belongs on the board.",
    label: "Roster",
  },
  {
    icon: "G",
    title: "Gear",
    href: "/wiki/gear",
    count: `${items.length} gear examples`,
    description:
      "Check requirements, price, slots, and effects for weapons, shields, trinkets, spells, and potions.",
    label: "Equipment",
  },
  {
    icon: "L",
    title: "Leaders",
    href: "/wiki/leaders",
    count: `${leaders.length} featured cards`,
    description:
      "See the leader cards currently shown in the game material, including their starting stats, slots, and traits.",
    label: "Leaders",
  },
  {
    icon: "T",
    title: "Traits",
    href: "/wiki/traits",
    count: `${units.length} traits on unit cards`,
    description:
      "Compare each trait with the unit that carries it, its listed effect, and its place on the board.",
    label: "Reference",
  },
  {
    icon: "F",
    title: "Factions",
    href: "/wiki/factions",
    count: `${factions.length} public factions`,
    description:
      "See the faction identities, roster names, and the unit cards currently available to inspect.",
    label: "Reference",
  },
];

export default function WikiIndexPage() {
  const recentEntries = updates.slice(0, 3);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Goodly Trials Wiki",
          description:
            "A player-focused Goodly Trials wiki for units, gear, leaders, traits, factions, and updates.",
          url: `${siteConfig.url}/wiki`,
          isPartOf: { "@id": `${siteConfig.url}/#website` },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: archiveSections.length,
            itemListElement: archiveSections.map((section, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: section.title,
              url: `${siteConfig.url}${section.href}`,
            })),
          },
        }}
      />

      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/game/hero-battlefield-v2.webp"
          alt="Pixel-art company facing enemy formations across a moonlit tactical battlefield"
          fill
          sizes="100vw"
          priority
        />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroInner}`}>
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Wiki" }]}
          />
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              Player wiki · latest published patch {siteConfig.latestPatchVersion}
            </p>
            <h1>The Goodly Trials Archive</h1>
            <p>
              Pick the part of the game you want to check, then open the card,
              item, leader, trait, or faction page you need. Each page shows
              whether it contains a full card, a roster name, or a player tip.
            </p>
          </div>
          <dl className={styles.heroStats}>
            <div>
              <dt>Unit cards</dt>
              <dd>{units.length}</dd>
            </div>
            <div>
              <dt>Gear examples</dt>
              <dd>{items.length}</dd>
            </div>
            <div>
              <dt>Leader cards</dt>
              <dd>{leaders.length}</dd>
            </div>
            <div>
              <dt>Factions</dt>
              <dd>{factions.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={`container section ${styles.archiveLayout}`}>
        <aside className={styles.archiveNav} aria-label="Wiki categories">
          <p className={styles.navLabel}>Wiki sections</p>
          <span className={styles.activeNav} aria-current="page">
            <span>⌂</span> Overview
          </span>
          {archiveSections.map((section) => (
            <Link href={section.href} key={section.href}>
              <span>{section.icon}</span>
              {section.title}
              <small>{section.count}</small>
            </Link>
          ))}
          <div className={styles.navDivider} />
          <p className={styles.navLabel}>Player tools</p>
          <Link href="/builder">
            <span>▦</span> Company Builder
          </Link>
          <Link href="/builds">
            <span>♟</span> Example Builds
          </Link>
          <Link href="/guides">
            <span>?</span> Player Guides
          </Link>
        </aside>

        <div className={styles.archiveContent}>
          <div className={styles.archiveStatus}>
            <span>LIVE</span>
            <p>
              <b>Latest published patch {siteConfig.latestPatchVersion}</b>
              <br />
              Last checked {siteConfig.lastVerified}. Counts show what is
              currently displayed here, not the game&apos;s complete roster.
            </p>
            <span>{archiveSections.length} Wiki sections</span>
          </div>

          <form className={styles.search} action="/search" role="search">
            <label htmlFor="wiki-search">Search the wiki</label>
            <div>
              <span aria-hidden="true">⌕</span>
              <input
                id="wiki-search"
                name="q"
                type="search"
                placeholder="Search a unit, gear item, trait, stat, or guide…"
              />
              <button type="submit">Search</button>
            </div>
          </form>

          <header className={styles.sectionHeader}>
            <div>
              <p>Find the right page</p>
              <h2>What do you want to check?</h2>
            </div>
            <span>Browse first · open details when needed</span>
          </header>
          <div className={styles.archiveList}>
            {archiveSections.map((section) => (
              <Link
                className={styles.archiveRow}
                href={section.href}
                key={section.href}
              >
                <span className={styles.rowIcon}>{section.icon}</span>
                <div>
                  <small>
                    {section.label} · {section.count}
                  </small>
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                </div>
                <b>Open list →</b>
              </Link>
            ))}
          </div>

          <section className={styles.latestSection}>
            <header className={styles.sectionHeader}>
              <div>
                <p>Patch context</p>
                <h2>Recent patch changes</h2>
              </div>
              <Link href="/updates">All updates →</Link>
            </header>
            <div className={styles.latestList}>
              {recentEntries.map((entry) => (
                <Link href={`/updates#${entry.slug}`} key={entry.slug}>
                  <time>{entry.date}</time>
                  <div>
                    <small>
                      {entry.type} · {entry.version}
                    </small>
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                  </div>
                  <b>Read →</b>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
