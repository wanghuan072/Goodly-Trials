import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import ItemCard from "@/components/content/ItemCard";
import UnitCard from "@/components/content/UnitCard";
import UnitSprite from "@/components/content/UnitSprite";
import { siteConfig } from "@/config/site";
import { builds, factions, guides, items, leaders, units, updates } from "@/lib/data/game-content";
import styles from "@/style/page/home/home.module.css";

const archiveLinks = [
  { href: "/wiki/units", symbol: "♜", title: "Units", copy: "Verified cards and tactics" },
  { href: "/wiki/items", symbol: "⚔", title: "Items", copy: "Weapons, shields, spells" },
  { href: "/wiki/factions", symbol: "⚑", title: "Factions", copy: "Three public companies" },
  { href: "/wiki/traits", symbol: "✦", title: "Traits", copy: "6 public-card traits" },
  { href: "/wiki/ascendancy", symbol: "✥", title: "Ascendancy", copy: "Character progression" },
  { href: "/wiki/bosses", symbol: "☠", title: "Bosses", copy: "Status verified; roster pending" },
];

const mechanics = [
  ["STR", "Strength"], ["AGI", "Agility"], ["INT", "Intelligence"], ["ES", "Energy Shield"],
  ["AR", "Armor"], ["EVA", "Evasion"], ["CRT", "Critical"], ["RNG", "Range"],
];

function PanelTitle({ children, href, link }: { children: ReactNode; href?: string; link?: string }) {
  return <header className={styles.panelTitle}><h2>{children}</h2>{href && link && <Link href={href}>{link} →</Link>}</header>;
}

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image className={styles.heroImage} src="/images/game/screenshot-3.webp" alt="Official Goodly Trials combat screenshot showing a company on the tactical battlefield" fill preload sizes="100vw" />
        <div className={styles.heroVeil} />
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.kicker}>Verified public data · {siteConfig.currentVersion}</p>
          <h1>Goodly Trials <span>Wiki</span></h1>
          <p className={styles.lede}>An independent archive of public unit cards, items, leaders, mechanics, patch context, and clearly labeled editorial guides.</p>
          <p className={styles.accessStatus}>Current access: invite-only browser beta · Steam: Coming soon</p>
          <div className={styles.heroActions}><Link className="button button-primary" href="/wiki">Explore Wiki</Link><Link className="button button-ghost" href="/guides/beginners-guide">Beginner&apos;s Guide</Link></div>
          <dl className={styles.heroFacts}>
            <div><dt>{units.length}</dt><dd>public unit cards</dd></div><div><dt>{leaders.length}</dt><dd>featured leaders</dd></div><div><dt>{items.length}</dt><dd>public item examples</dd></div><div><dt>{siteConfig.currentVersion}</dt><dd>verified patch</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.searchBand} aria-label="Search the wiki">
        <form className={`container ${styles.heroSearch}`} action="/search" role="search">
          <label className="sr-only" htmlFor="hero-search">Search Goodly Trials Wiki</label>
          <div><span aria-hidden="true">⌕</span><input id="hero-search" name="q" type="search" placeholder="Search units, items, traits, guides…" /><button type="submit">Search</button></div>
          <nav aria-label="Quick search links"><Link href="/wiki/units">♜ Units</Link><Link href="/wiki/items">♜ Items</Link><Link href="/wiki/traits">✦ Traits</Link><Link href="/guides">▣ Guides</Link></nav>
        </form>
      </section>

      <div className={`container ${styles.board}`}>
        <section className={styles.exploreRow}>
          <div className={styles.frame}>
            <PanelTitle>Explore Goodly Trials</PanelTitle>
            <div className={styles.archiveGrid}>{archiveLinks.map((item) => <Link className={styles.archiveCard} key={item.href} href={item.href}><b aria-hidden="true">{item.symbol}</b><h3>{item.title}</h3><p>{item.copy}</p><span>Browse</span></Link>)}</div>
          </div>
          <aside className={`${styles.frame} ${styles.tierPanel}`}>
            <PanelTitle href="/tier-list" link="Methodology">Ranking Evidence Status</PanelTitle>
            <div className={styles.tierRows}>
              <div><strong>Data</strong>{units.slice(0, 4).map((unit) => <UnitSprite key={unit.slug} src={unit.image} color={unit.accent} />)}</div>
              <div><strong>Field</strong>{units.slice(2, 6).map((unit) => <UnitSprite key={unit.slug} src={unit.image} color={unit.accent} />)}</div>
              <div><strong>Rank</strong><span>No placements published</span></div>
            </div>
            <p className={styles.tierNote}>Verified cards are available, but rankings remain withheld until mode-specific, repeatable match evidence can support them.</p>
          </aside>
        </section>

        <section className={styles.showcaseRow}>
          <div className={styles.frame}>
            <PanelTitle href="/wiki/units" link="View unit cards">Verified Unit Cards</PanelTitle>
            <div className={styles.unitGrid}>{units.map((unit) => <UnitCard key={unit.slug} unit={unit} />)}</div>
          </div>
          <div className={styles.frame}>
            <PanelTitle href="/wiki/items" link="Browse examples">Public Item Examples</PanelTitle>
            <div className={styles.itemGrid}>{items.slice(0, 4).map((item) => <ItemCard key={item.slug} item={item} />)}</div>
          </div>
        </section>

        <section className={styles.threeColumns}>
          <div className={styles.frame}><PanelTitle href="/builds" link="View all builds">Editorial Starter Builds</PanelTitle><div className={styles.linkList}>{builds.map((build) => <Link key={build.slug} href={`/builds/${build.slug}`}><span className={styles.listIcon}>♜</span><div><h3>{build.title}</h3><p>{build.summary}</p></div><small>{build.difficulty}</small></Link>)}</div></div>
          <div className={styles.frame}><PanelTitle href="/guides" link="View all guides">Player Guides</PanelTitle><div className={styles.linkList}>{guides.slice(0, 4).map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`}><span className={styles.listIcon}>✥</span><div><h3>{guide.title}</h3><p>{guide.excerpt}</p></div></Link>)}</div></div>
          <div className={styles.frame}><PanelTitle href="/updates" link="View selected notes">Recent Verified Updates</PanelTitle><div className={styles.linkList}>{updates.slice(0, 4).map((update) => <Link key={update.slug} href={`/updates/${update.slug}`}><span className={styles.listIcon}>◈</span><div><h3>{update.version} · {update.title}</h3><p>{update.date}</p></div></Link>)}</div></div>
        </section>

        <section className={styles.bottomRow}>
          <div className={styles.frame}><PanelTitle href="/wiki/mechanics/stats" link="View all mechanics">Learn the Game</PanelTitle><div className={styles.mechanicsGrid}>{mechanics.map(([abbr, label]) => <Link href="/wiki/mechanics/stats" key={abbr}><b>{abbr}</b><span>{label}</span></Link>)}</div></div>
          <div className={styles.frame}><PanelTitle href="/wiki/factions" link="View factions">Choose Your Faction</PanelTitle><div className={styles.factionGrid}>{factions.map((faction) => <Link key={faction.slug} href={`/wiki/factions/${faction.slug}`} style={{ "--faction": faction.accent } as CSSProperties}><UnitSprite src={faction.image} color={faction.accent} large /><div><h3>{faction.name}</h3><p>{faction.summary}</p><span>Explore →</span></div></Link>)}</div></div>
        </section>

        <section className={`${styles.frame} ${styles.sourcePanel}`}>
          <div><p className={styles.kicker}>Source-conscious by design</p><h2>Verified game data, clearly separated from strategy notes.</h2></div>
          <p>Unit, item, and featured-leader values were checked against official public {siteConfig.currentVersion} material on {siteConfig.lastVerified}. Builds and positioning notes are labeled editorial; rankings are not yet published.</p>
          <Link className="button button-ghost" href="/about">How this wiki works</Link>
        </section>
      </div>
    </main>
  );
}
