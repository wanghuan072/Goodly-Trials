import Image from "next/image";
import Link from "next/link";
import ItemCard from "@/components/content/ItemCard";
import UnitCard from "@/components/content/UnitCard";
import UnitSprite from "@/components/content/UnitSprite";
import { builds, factions, guides, items, units, updates } from "@/lib/data/game-content";
import styles from "@/style/page/home/home.module.css";

const archiveLinks = [
  { href: "/wiki/units", symbol: "♜", title: "Units", copy: "Verified cards, traits, tactics, and core stats." },
  { href: "/wiki/items", symbol: "⚔", title: "Items", copy: "Requirements, effects, costs, and item types." },
  { href: "/wiki/factions", symbol: "⚑", title: "Factions", copy: "Goodly Folk, Bone Host, and Belowborn." },
  { href: "/wiki/traits", symbol: "✦", title: "Traits", copy: "Read the rules that make every recruit peculiar." },
  { href: "/wiki/ascendancy", symbol: "✥", title: "Ascendancy", copy: "Power, Fortitude, and Authority paths." },
  { href: "/wiki/bosses", symbol: "☠", title: "Bosses", copy: "A cautious index for verified trial encounters." },
];

const mechanics = [
  ["STR", "HP, armor, recovery"], ["AGI", "Speed and evasion"], ["INT", "MP, regen, energy shield"], ["ES", "Damage buffer"],
  ["AR", "Flat damage reduction"], ["EVA", "Chance to avoid"], ["CRT", "Double-damage chance"], ["RNG", "Attack range in tiles"],
];

export default function HomePage() {
  return (
    <main>
      <section className={styles.hero}>
        <Image className={styles.heroImage} src="/images/game/screenshot-3.webp" alt="Goodly Trials battlefield with multiple companies in formation" fill preload sizes="100vw" />
        <div className={styles.heroVeil} />
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.kicker}>Independent field archive · Verified for v0.300</p>
          <h1>Goodly Trials <span>Wiki</span></h1>
          <p className={styles.lede}>Verified units, items, factions, mechanics, builds, and patch context for the turn-based strategy auto-battler.</p>
          <div className={styles.heroActions}><Link className="button button-primary" href="/wiki">Explore the Wiki</Link><Link className="button button-ghost" href="/tier-list">Tier Methodology</Link></div>
          <dl className={styles.heroFacts}>
            <div><dt>12</dt><dd>trials to survive</dd></div><div><dt>3</dt><dd>public factions</dd></div><div><dt>2–8</dt><dd>multiplayer seats</dd></div><div><dt>v0.300</dt><dd>verified version</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.searchBand} aria-label="Search the wiki">
        <form className={`container ${styles.heroSearch}`} action="/search" role="search">
          <label htmlFor="hero-search">Search the field archive</label>
          <div><span aria-hidden="true">⌕</span><input id="hero-search" name="q" type="search" placeholder="Search units, items, traits, guides…" /><button type="submit">Search</button></div>
        </form>
      </section>

      <section className={`container section ${styles.explore}`}>
        <div className="section-heading"><p>The archive</p><h2>Explore Goodly Trials</h2><span>Start with a verified rules page, then follow the links between units, gear, factions, and strategy notes.</span></div>
        <div className={styles.archiveGrid}>{archiveLinks.map((item) => <Link className={styles.archiveCard} key={item.href} href={item.href}><b aria-hidden="true">{item.symbol}</b><h3>{item.title}</h3><p>{item.copy}</p><span>Open archive →</span></Link>)}</div>
      </section>

      <section className={styles.darkSection}>
        <div className="container section">
          <div className="section-heading section-heading-row"><div><p>Verified field cards</p><h2>Popular Units</h2></div><Link href="/wiki/units">View all units →</Link></div>
          <div className={styles.unitGrid}>{units.map((unit) => <UnitCard key={unit.slug} unit={unit} />)}</div>
          <p className={styles.sourceNote}>Stats shown here are transcribed from the official v0.300 mechanics page and dated 19 August 2026.</p>
        </div>
      </section>

      <section className={`container section ${styles.factionSection}`}>
        <div className="section-heading"><p>Choose a company</p><h2>Three Public Factions</h2><span>Each faction description below is grounded in the official mechanics archive; broader meta claims remain editorial.</span></div>
        <div className={styles.factionGrid}>{factions.map((faction) => <Link className={styles.factionCard} key={faction.slug} href={`/wiki/factions/${faction.slug}`} style={{ "--faction": faction.accent } as React.CSSProperties}><UnitSprite src={faction.image} color={faction.accent} large /><div><p>{faction.name}</p><h3>{faction.summary}</h3><span>{faction.playstyle}</span><b>Enter faction archive →</b></div></Link>)}</div>
      </section>

      <section className={styles.splitSection}>
        <div className={`container section ${styles.splitGrid}`}>
          <div>
            <div className="section-heading section-heading-row"><div><p>Verified equipment</p><h2>Popular Items</h2></div><Link href="/wiki/items">Browse all items →</Link></div>
            <div className={styles.itemGrid}>{items.slice(0, 6).map((item) => <ItemCard key={item.slug} item={item} />)}</div>
          </div>
          <aside className={styles.tierPanel}>
            <p className={styles.kicker}>Trust before ranking</p><h2>Tier List Status</h2><div className={styles.tierSeal}>v0.300</div><p>No permanent S/A/B claims have been published yet. The archive separates verified unit data from editorial testing and will show patch, mode, criteria, and sample notes when rankings are ready.</p><Link className="button button-ghost" href="/tier-list">Read the methodology</Link>
          </aside>
        </div>
      </section>

      <section className={`container section ${styles.notesSection}`}>
        <div className={styles.noteColumn}><div className="section-heading section-heading-row"><div><p>Field-tested ideas</p><h2>Build Notes</h2></div><Link href="/builds">All builds →</Link></div>{builds.map((build) => <Link className={styles.noteRow} key={build.slug} href={`/builds/${build.slug}`}><span>{build.faction}</span><div><h3>{build.title}</h3><p>{build.summary}</p></div><b>{build.version}</b></Link>)}</div>
        <div className={styles.noteColumn}><div className="section-heading section-heading-row"><div><p>Learn the road</p><h2>Guides</h2></div><Link href="/guides">All guides →</Link></div>{guides.slice(0, 5).map((guide) => <Link className={styles.noteRow} key={guide.slug} href={`/guides/${guide.slug}`}><span>{guide.category}</span><div><h3>{guide.title}</h3><p>{guide.excerpt}</p></div><b>Read</b></Link>)}</div>
      </section>

      <section className={styles.mechanicsSection}>
        <div className="container section"><div className="section-heading section-heading-row"><div><p>Read the card</p><h2>Learn the Core Stats</h2></div><Link href="/wiki/mechanics/stats">Full stats guide →</Link></div><div className={styles.mechanicsGrid}>{mechanics.map(([abbr, copy]) => <div key={abbr}><b>{abbr}</b><span>{copy}</span></div>)}</div></div>
      </section>

      <section className={`container section ${styles.updatesSection}`}>
        <div className="section-heading section-heading-row"><div><p>Version watch</p><h2>Latest Updates</h2></div><Link href="/updates">Full update archive →</Link></div>
        <div className={styles.timeline}>{updates.slice(0, 4).map((update) => <Link key={update.slug} href={`/updates/${update.slug}`}><time>{update.date}</time><span>{update.type}</span><div><h3>{update.version} · {update.title}</h3><p>{update.summary}</p></div><b>Impact →</b></Link>)}</div>
      </section>

      <section className={styles.faqSection}>
        <div className={`container section ${styles.faqGrid}`}><div className="section-heading"><p>Quick counsel</p><h2>Goodly Trials FAQ</h2><span>Answers below reflect current public official material, not the placeholder data in the visual references.</span></div><div>
          <details><summary>What is Goodly Trials?</summary><p>A turn-based strategy game with roguelike and auto-battler elements. You hire, equip, place, and commit a company to battle.</p></details>
          <details><summary>How long is a single-player journey?</summary><p>The public rules describe twelve trials. Three battles without a win end the journey.</p></details>
          <details><summary>Is Goodly Trials multiplayer?</summary><p>Yes. The official description supports 2–8 player tournaments with shared markets, live bidding, AI seats, and season standings.</p></details>
          <details><summary>How current is this wiki?</summary><p>The first verified dataset targets v0.300 and was checked on 19 August 2026. Every data page carries its own version and source.</p></details>
        </div></div>
      </section>
    </main>
  );
}
