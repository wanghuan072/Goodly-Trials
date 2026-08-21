import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { factions, leaders } from "@/lib/data/game-content";
import type { Leader } from "@/types/content";
import styles from "@/style/page/wiki/detail.module.css";

export default function LeaderDetailPage({ leader }: { leader: Leader }) {
  const faction = factions.find((entry) => entry.slug === leader.factionSlug);
  const relatedLeaders = leaders.filter((entry) => entry.slug !== leader.slug && entry.factionSlug === leader.factionSlug).slice(0, 3);
  return <main className={`container ${styles.detailShell}`}>
    <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Leaders", href: "/wiki/leaders" }, { label: leader.name }]} />
    <div className={styles.detailGrid}>
      <article className={styles.detailMain}>
        <header className={styles.leaderHero}>
          <p className={styles.recordKicker}>Featured leader card · {leader.gameVersion}</p>
          <h1>{leader.name}</h1>
          {leader.epithet && <p className={styles.epithet}>{leader.epithet}</p>}
          <div className={styles.badges}><span>♛ {leader.faction}</span><span>{leader.gear} gear slots</span><span>{leader.trinkets} trinket slots</span></div>
          <dl className={styles.statStrip}>{[["ES", leader.stats.es], ["HP", leader.stats.hp], ["MP", leader.stats.mp], ["STR", leader.stats.str], ["AGI", leader.stats.agi], ["INT", leader.stats.int]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </header>
        <section className={styles.panel}><h2>Leader overview</h2><p>{leader.name} is a public featured leader card for the {leader.faction}. This page records the values currently visible in that source; it does not infer a full leader kit, progression, or ranking beyond those details.</p></section>
        <section className={styles.panel}><h2>Trait: {leader.trait.name}</h2><div className={styles.traitBody}><span>♛</span><div><p>{leader.trait.effect}</p><em>Verified public trait text</em></div></div></section>
        <section className={styles.panel}><h2>Starting card</h2><div className={styles.tableScroll}><table className={styles.statsTable}><thead><tr><th>ES</th><th>HP</th><th>MP</th><th>STR</th><th>AGI</th><th>INT</th><th>Gear</th><th>Trinkets</th><th>Version</th></tr></thead><tbody><tr><td>{leader.stats.es}</td><td>{leader.stats.hp}</td><td>{leader.stats.mp}</td><td>{leader.stats.str}</td><td>{leader.stats.agi}</td><td>{leader.stats.int}</td><td>{leader.gear}</td><td>{leader.trinkets}</td><td>{leader.gameVersion}</td></tr></tbody></table></div><p>Published card values can change with later patches. Last verified {leader.lastVerified}.</p></section>
        <section className={`${styles.panel} ${styles.editorial}`}><h2>Related records</h2><p className={styles.disclaimer}>Links below are archive navigation, not a claim that these leaders are interchangeable or equally strong.</p><div className={styles.relatedGrid}>{relatedLeaders.map((entry) => <Link href={`/wiki/leaders/${entry.slug}`} key={entry.slug}><b>{entry.name}</b><span>{entry.trait.name} · {entry.gameVersion}</span></Link>)}{faction && <Link href={`/wiki/factions/${faction.slug}`}><b>{faction.name}</b><span>Faction overview and public roster context.</span></Link>}</div></section>
      </article>
      <aside className={styles.sideProfile}>
        <h2>Leader record</h2>
        <dl><div><dt>Faction</dt><dd><Link href={`/wiki/factions/${leader.factionSlug}`}>{leader.faction}</Link></dd></div><div><dt>Trait</dt><dd>{leader.trait.name}</dd></div><div><dt>Gear slots</dt><dd>{leader.gear}</dd></div><div><dt>Trinket slots</dt><dd>{leader.trinkets}</dd></div><div><dt>Card version</dt><dd>{leader.gameVersion}</dd></div><div><dt>Verified</dt><dd>{leader.lastVerified}</dd></div></dl>
        <h3>Explore</h3><Link href="/wiki/leaders">All leaders</Link><Link href={`/wiki/factions/${leader.factionSlug}`}>{leader.faction}</Link><Link href="/updates">Patch notes</Link>
        <h3>Primary source</h3><a href={leader.source} target="_blank" rel="noreferrer">Official leader cards ↗</a>
      </aside>
    </div>
  </main>;
}
