import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { units, updates } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata("Goodly Trials Wiki", "Browse verified Goodly Trials units, items, factions, traits, ascendancy, leaders, bosses, and mechanics.", "/wiki");

const portals = [
  ["♜", "Units", "/wiki/units", "Core stats, traits, skills, tactics, and versioned source notes."], ["⚔", "Items", "/wiki/items", "Requirements, effects, prices, and equipment types."],
  ["⚑", "Factions", "/wiki/factions", "Goodly Folk, Bone Host, and Belowborn roster context."], ["✦", "Traits", "/wiki/traits", "Verified unit traits and their exact gameplay effects."],
  ["✥", "Ascendancy", "/wiki/ascendancy", "Power, Fortitude, Authority, and verified Ascendancy examples."], ["♛", "Leaders", "/wiki/leaders", "How leaders begin a journey and which names are publicly verified."],
  ["☠", "Bosses", "/wiki/bosses", "What the public rules confirm without inventing encounter data."], ["⌘", "Mechanics", "/wiki/mechanics", "Modes, stats, formation, flanking, markets, and the twelve-trial road."],
];

export default function WikiPage() {
  return <main><section className={styles.hero}><Image className={styles.heroImage} src="/images/game/screenshot-5.webp" alt="Goodly Trials combat log and unit stat interface" fill sizes="100vw" /><div className={styles.heroShade} /><div className={`container ${styles.heroContent}`}><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki" }]} /><p className={styles.eyebrow}>Database entrance · v0.300</p><h1>Goodly Trials Wiki</h1><p>A higher-density archive for verified game data. Each record separates official facts from editorial interpretation and carries a source date.</p></div></section><section className="container section"><div className={styles.portalGrid}>{portals.map(([symbol, title, href, copy]) => <Link className={styles.portalCard} href={href} key={href}><span aria-hidden="true">{symbol}</span><h2>{title}</h2><p>{copy}</p><b>Browse {title} →</b></Link>)}</div><div className={styles.contentGrid} style={{ marginTop: 54 }}><div className={styles.mainColumn}><div className="section-heading"><p>Recently verified</p><h2>Fresh archive entries</h2></div><div className={styles.entryList}>{[...units.slice(0, 3).map((unit) => ({ meta: unit.faction, title: unit.name, copy: unit.summary, href: `/wiki/units/${unit.slug}`, tag: unit.gameVersion })), ...updates.slice(0, 2).map((update) => ({ meta: update.date, title: update.title, copy: update.summary, href: `/updates/${update.slug}`, tag: update.version }))].map((entry) => <Link className={styles.entryRow} href={entry.href} key={entry.href}><span>{entry.meta}</span><div><h3>{entry.title}</h3><p>{entry.copy}</p></div><b>{entry.tag} →</b></Link>)}</div></div><aside className={styles.sidebar}><h2>Archive rules</h2><p className={styles.sourceBox}><strong>Facts are sourced.</strong><br />Recommendations are labeled editorial. Unverified UI mockup data is never treated as game data.</p><h3>Start here</h3><Link href="/guides/beginners-guide">Beginner&apos;s guide</Link><Link href="/wiki/mechanics/stats">Stats explained</Link><Link href="/updates">Version history</Link></aside></div></section></main>;
}
