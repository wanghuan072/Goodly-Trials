import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroVideo from "@/page/home/HeroVideo";
import UnitSprite from "@/components/content/UnitSprite";
import { siteConfig } from "@/config/site";
import {
  builds,
  factions,
  guides,
  items,
  units,
  updates,
} from "@/lib/data/game-content";
import type { Item, Unit } from "@/types/content";
import JsonLd from "@/seo/JsonLd";
import { pageTdk } from "@/seo/tdk";
import styles from "@/style/page/home/home.module.css";

const archiveLinks = [
  {
    href: "/wiki/units",
    symbol: "U",
    title: "Units",
    copy: "Cards, stats, and tactics",
  },
  {
    href: "/wiki/gear",
    symbol: "G",
    title: "Gear",
    copy: "Weapons, shields, trinkets",
  },
  {
    href: "/wiki/factions",
    symbol: "F",
    title: "Factions",
    copy: "Three public companies",
  },
  {
    href: "/wiki/traits",
    symbol: "T",
    title: "Traits",
    copy: "Unit traits and effects",
  },
  {
    href: "/wiki/leaders",
    symbol: "L",
    title: "Leaders",
    copy: "Seven featured cards",
  },
  {
    href: "/guides",
    symbol: "N",
    title: "Guides",
    copy: "Rules, tactics, and modes",
  },
];

const mechanics = [
  ["STR", "Strength"],
  ["AGI", "Agility"],
  ["INT", "Intelligence"],
  ["ES", "Energy Shield"],
  ["AR", "Armor"],
  ["EVA", "Evasion"],
  ["CRT", "Critical"],
  ["RNG", "Range"],
];

const featuredUnitSlugs = [
  "goodly-knight",
  "portly-knight",
  "archer",
  "wizard",
  "skeleton-child",
  "skeleton-dog",
];

const featuredUnits = featuredUnitSlugs
  .map((slug) => units.find((unit) => unit.slug === slug))
  .filter((unit): unit is Unit => Boolean(unit));

function PanelTitle({
  children,
  href,
  link,
}: {
  children: ReactNode;
  href?: string;
  link?: string;
}) {
  return (
    <header className={styles.panelTitle}>
      <h2>{children}</h2>
      {href && link && <Link href={href}>{link} →</Link>}
    </header>
  );
}

function HomeUnitEntry({ unit }: { unit: Unit }) {
  return (
    <Link className={styles.referenceEntry} href={`/wiki/units/${unit.slug}`}>
      <span className={`${styles.referenceArt} ${styles.unitReferenceArt}`}>
        <UnitSprite src={unit.image} color={unit.accent} />
      </span>
      <span className={styles.referenceCopy}>
        <small>{unit.faction}</small>
        <strong>{unit.name}</strong>
        <span>STR {unit.stats.str} · AGI {unit.stats.agi} · INT {unit.stats.int}</span>
        <em>{unit.cost ?? "—"}G · {unit.tactic.name}</em>
      </span>
      <span className={styles.referenceArrow} aria-hidden="true">→</span>
    </Link>
  );
}

function HomeItemEntry({ item }: { item: Item }) {
  const artworkPending = item.image.endsWith("item-data-pending.svg");

  return (
    <Link className={styles.referenceEntry} href={`/wiki/gear/${item.slug}`}>
      <span className={`${styles.referenceArt} ${styles.itemReferenceArt}`}>
        <Image
          src={item.image}
          alt={artworkPending ? `${item.name} artwork pending` : `${item.name} official game icon`}
          width={62}
          height={62}
          unoptimized={item.image.endsWith(".gif")}
        />
      </span>
      <span className={styles.referenceCopy}>
        <small>{item.type}</small>
        <strong>{item.name}</strong>
        <span>{item.effects.slice(0, 2).join(" · ")}</span>
        <em>{item.cost === undefined ? "Cost not published" : `${item.cost}G`}</em>
      </span>
      <span className={styles.referenceArrow} aria-hidden="true">→</span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className={styles.page}>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", "@id": `${siteConfig.url}/#webpage`, url: siteConfig.url, name: pageTdk["/"].title, description: pageTdk["/"].description, isPartOf: { "@id": `${siteConfig.url}/#website` }, about: { "@id": `${siteConfig.url}/#game` }, inLanguage: "en" }} />
      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/game/hero-battlefield-v2.webp"
          alt="Pixel-art company facing enemy formations across a moonlit tactical battlefield"
          fill
          preload
          sizes="100vw"
        />
        <div className={styles.heroVeil} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Player guide · company planning archive</p>
            <h1>
              Goodly Trials <span>- Guide, Units, Gear &amp; Builds</span>
            </h1>
            <p className={styles.lede}>
              Check units and gear, sketch a formation, and head into your next
              run with a plan you can actually change. Start with the cards,
              builds, guides, and patch changes that matter to your company.
            </p>
            <div className={styles.heroActions}>
              <Link className="button button-primary" href="/builder">
                Build a Company
              </Link>
              <Link className="button button-ghost" href="/wiki">
                Explore Wiki
              </Link>
              <Link
                className="button button-ghost"
                href="/guides/beginners-guide"
              >
                Beginner&apos;s Guide
              </Link>
            </div>
          </div>
          <HeroVideo />
        </div>
      </section>

      <section className={styles.searchBand} aria-label="Search the wiki">
        <form
          className={`container ${styles.heroSearch}`}
          action="/search"
          role="search"
        >
          <label className="sr-only" htmlFor="hero-search">
            Search Goodly Trials Wiki
          </label>
          <div>
            <span aria-hidden="true">⌕</span>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="Search units, gear, traits, guides…"
            />
            <button type="submit">Search</button>
          </div>
          <nav aria-label="Quick search links">
            <Link href="/wiki/units">Units</Link>
            <Link href="/wiki/gear">Gear</Link>
            <Link href="/wiki/traits">Traits</Link>
            <Link href="/guides">Guides</Link>
          </nav>
        </form>
      </section>

      <div className={`container ${styles.board}`}>
        <section className={styles.exploreRow}>
          <div className={styles.frame}>
            <PanelTitle>Explore Goodly Trials</PanelTitle>
            <div className={styles.archiveGrid}>
              {archiveLinks.map((item) => (
                <Link
                  className={styles.archiveCard}
                  key={item.href}
                  href={item.href}
                >
                  <b aria-hidden="true">{item.symbol}</b>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <span>Browse</span>
                </Link>
              ))}
            </div>
          </div>
          <aside className={`${styles.frame} ${styles.tierPanel}`}>
            <PanelTitle href="/builder" link="Open Builder">
              Plan Your Company
            </PanelTitle>
            <div className={styles.tierRows}>
              <div>
                <strong>Board</strong>
                {units.slice(0, 4).map((unit) => (
                  <UnitSprite
                    key={unit.slug}
                    src={unit.image}
                    color={unit.accent}
                  />
                ))}
              </div>
              <div>
                <strong>Gear</strong>
                {units.slice(2, 6).map((unit) => (
                  <UnitSprite
                    key={unit.slug}
                    src={unit.image}
                    color={unit.accent}
                  />
                ))}
              </div>
              <div>
                <strong>Build</strong>
                <span>Drag units and equipment into a legal starting board.</span>
              </div>
            </div>
            <p className={styles.tierNote}>
              Start with the cards shown here, test the formation in game, then
              return to adjust the plan for your next run.
            </p>
          </aside>
        </section>

        <section className={styles.showcaseRow}>
          <div className={styles.frame}>
            <PanelTitle href="/wiki/units" link="View unit cards">
              Unit Cards
            </PanelTitle>
            <div className={`${styles.referenceList} ${styles.unitReferenceList}`}>
              {featuredUnits.map((unit) => (
                <HomeUnitEntry key={unit.slug} unit={unit} />
              ))}
            </div>
          </div>
          <div className={styles.frame}>
            <PanelTitle href="/wiki/gear" link="Browse examples">
              Gear You Can Check
            </PanelTitle>
            <div className={`${styles.referenceList} ${styles.itemReferenceList}`}>
              {items.slice(0, 3).map((item) => (
                <HomeItemEntry key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.threeColumns}>
          <div className={styles.frame}>
            <PanelTitle href="/builds" link="View all builds">
              Starting Builds
            </PanelTitle>
            <div className={styles.linkList}>
              {builds.map((build) => (
                <Link key={build.slug} href={`/builds#${build.slug}`}>
                  <span className={styles.listIcon}>B</span>
                  <div>
                    <h3>{build.title}</h3>
                    <p>{build.summary}</p>
                  </div>
                  <small>{build.difficulty}</small>
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.frame}>
            <PanelTitle href="/guides" link="View all guides">
              Player Guides
            </PanelTitle>
            <div className={styles.linkList}>
              {guides.slice(0, 4).map((guide) => (
                <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                  <span className={styles.listIcon}>✥</span>
                  <div>
                    <h3>{guide.title}</h3>
                    <p>{guide.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.frame}>
            <PanelTitle href="/updates" link="View selected notes">
              Recent Updates
            </PanelTitle>
            <div className={styles.linkList}>
              {updates.slice(0, 4).map((update) => (
                <Link key={update.slug} href={`/updates#${update.slug}`}>
                  <span className={styles.listIcon}>◈</span>
                  <div>
                    <h3>
                      {update.version} · {update.title}
                    </h3>
                    <p>{update.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.bottomRow}>
          <div className={styles.frame}>
            <PanelTitle href="/guides" link="View all guides">
              Learn the Game
            </PanelTitle>
            <div className={styles.mechanicsGrid}>
              {mechanics.map(([abbr, label]) => (
                <Link href="/guides/beginners-guide" key={abbr}>
                  <b>{abbr}</b>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.frame}>
            <PanelTitle href="/wiki/factions" link="View factions">
              Choose Your Faction
            </PanelTitle>
            <div className={styles.factionGrid}>
              {factions.map((faction) => (
                <Link
                  className={styles.factionDossier}
                  key={faction.slug}
                  href={`/wiki/factions/${faction.slug}`}
                  style={{ "--faction": faction.accent } as CSSProperties}
                >
                  <span className={styles.factionDossierHead}>
                    <span className={styles.factionMark}>
                      <UnitSprite
                        src={faction.image}
                        color={faction.accent}
                        large
                      />
                    </span>
                    <span>
                      <strong>{faction.name}</strong>
                      <small>{faction.roster.length} known units</small>
                    </span>
                  </span>
                  <span className={styles.factionPitch}>{faction.playstyle}</span>
                  <span className={styles.factionAction}>
                    Open roster <b aria-hidden="true">→</b>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.infoRow}>
          <article className={styles.frame}>
            <p className={styles.kicker}>Built for the moment before a match</p>
            <h2>Check the card. Shape the board. Try the idea.</h2>
            <p>
              This site brings together the parts of Goodly Trials that players
              tend to look up mid-run: unit stats, gear requirements, leader
              cards, faction context, formation ideas, and patch changes. It is
              a planning companion, not the official game or a promise that one
              setup will win every fight.
            </p>
            <Link className="button button-ghost" href="/about">
              How this site is maintained
            </Link>
          </article>
          <article className={styles.frame}>
            <p className={styles.kicker}>Questions players ask first</p>
            <h2>Before you build a company</h2>
            <div className={styles.faqGrid}>
              <div><h3>Is this an official site?</h3><p>No. It is an independent player guide that links back to the official game pages.</p></div>
              <div><h3>Can a build guarantee a win?</h3><p>No. Builds are editable starting points; the live board, shop, and opponents still decide the run.</p></div>
              <div><h3>What does the Builder check?</h3><p>It checks the selected week, active cells, follower limits, and known equipment capacity.</p></div>
              <div><h3>Where should I begin?</h3><p>Choose a leader, compare the unit roles you need, then test the spacing in the Builder.</p></div>
            </div>
          </article>
        </section>

        <section className={`${styles.frame} ${styles.sourcePanel}`}>
          <div>
            <p className={styles.kicker}>Keep the facts and the ideas separate</p>
            <h2>Use the game data to make your own call.</h2>
          </div>
          <p>
            Compare the cards, effects, and formation rules first. Then treat
            builds and positioning notes as editable starting points for your
            own company.
          </p>
          <Link className="button button-ghost" href="/about">
            Read how it works
          </Link>
        </section>

      </div>
    </main>
  );
}
