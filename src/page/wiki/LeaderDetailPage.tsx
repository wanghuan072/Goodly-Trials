import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import UnitSprite from "@/components/content/UnitSprite";
import { builds, factions, leaders, units } from "@/lib/data/game-content";
import { getLeaderCompanyPlan } from "@/lib/data/editorial-recommendations";
import type { Leader } from "@/types/content";
import { hasCompleteLeaderCard } from "@/lib/data/record-coverage";
import styles from "@/style/page/wiki/detail.module.css";

export default function LeaderDetailPage({ leader }: { leader: Leader }) {
  const faction = factions.find((entry) => entry.slug === leader.factionSlug);
  const relatedLeaders = leaders.filter((entry) => entry.slug !== leader.slug && entry.factionSlug === leader.factionSlug).slice(0, 3);
  const companyPlan = getLeaderCompanyPlan(leader, units);
  const companyUnits = companyPlan.unitSlugs
    .map((slug) => units.find((unit) => unit.slug === slug))
    .filter((unit): unit is NonNullable<typeof unit> => Boolean(unit));
  const leaderBuilds = builds.filter((build) => build.leaderSlug === leader.slug);
  return <main className={`container ${styles.detailShell}`}>
    <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Leaders", href: "/wiki/leaders" }, { label: leader.name }]} />
    <div className={styles.detailGrid}>
      <article className={styles.detailMain}>
        <header className={styles.leaderHero}>
          <p className={styles.recordKicker}>Featured leader card</p>
          <h1>{leader.name}</h1>
          {leader.epithet && <p className={styles.epithet}>{leader.epithet}</p>}
          <div className={styles.badges}><span>♛ {leader.faction}</span><span>{leader.gear} gear slots</span><span>{leader.trinkets} trinket slots</span></div>
          <dl className={styles.statStrip}>{[["ES", leader.stats.es], ["HP", leader.stats.hp], ["MP", leader.stats.mp], ["STR", leader.stats.str], ["AGI", leader.stats.agi], ["INT", leader.stats.int]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </header>
        <section className={styles.panel}><h2>Leader overview</h2><p>{leader.name} leads the {leader.faction}. Compare the starting attributes, equipment capacity, and trait below before building the rest of the company.</p></section>
        <section className={styles.panel}><h2>Trait: {leader.trait.name}</h2><div className={styles.traitBody}><span>♛</span><div><p>{leader.trait.effect}</p><em>Leader trait</em></div></div></section>
        <section className={styles.panel}><h2>Starting card</h2><div className={styles.tableScroll}><table className={styles.statsTable}><thead><tr><th>ES</th><th>HP</th><th>MP</th><th>STR</th><th>AGI</th><th>INT</th><th>Gear</th><th>Trinkets</th></tr></thead><tbody><tr><td>{leader.stats.es}</td><td>{leader.stats.hp}</td><td>{leader.stats.mp}</td><td>{leader.stats.str}</td><td>{leader.stats.agi}</td><td>{leader.stats.int}</td><td>{leader.gear}</td><td>{leader.trinkets}</td></tr></tbody></table></div></section>
        <section className={`${styles.panel} ${styles.editorial}`} id="company-plan">
          <h2>Company Starting Point</h2>
          <p>{companyPlan.note}</p>
          <div className={styles.relatedGrid}>
            {companyUnits.map((unit) => <Link className={styles.relatedUnit} href={`/wiki/units/${unit.slug}`} key={unit.slug}><UnitSprite src={unit.image} color={unit.accent} /><span className={styles.relatedUnitCopy}><b>{unit.name}</b><small>{unit.cost ?? "—"}G · {unit.tactic.name}</small></span></Link>)}
            <Link href="/builder"><b>Open in Builder</b><span>Place these cards on the current board and adjust the plan to your own run.</span></Link>
          </div>
        </section>
        {leaderBuilds.length > 0 && <section className={`${styles.panel} ${styles.editorial}`} id="build-notes"><h2>Editable Build Notes</h2><div className={styles.relatedGrid}>{leaderBuilds.map((build) => <Link href={`/builds#${build.slug}`} key={build.slug}><b>{build.title}</b><span>{build.summary}</span></Link>)}</div></section>}
        <section className={`${styles.panel} ${styles.editorial}`}><h2>Related records</h2><div className={styles.relatedGrid}>{relatedLeaders.map((entry) => <Link href={`/wiki/leaders/${entry.slug}`} key={entry.slug}><b>{entry.name}</b><span>{entry.trait.name}</span></Link>)}{faction && <Link href={`/wiki/factions/${faction.slug}`}><b>{faction.name}</b><span>Faction overview and roster.</span></Link>}</div></section>
      </article>
      <aside className={styles.sideProfile}>
        <h2>Leader card</h2>
        <dl><div><dt>Faction</dt><dd><Link href={`/wiki/factions/${leader.factionSlug}`}>{leader.faction}</Link></dd></div><div><dt>Trait</dt><dd>{leader.trait.name}</dd></div><div><dt>Gear slots</dt><dd>{leader.gear}</dd></div><div><dt>Trinket slots</dt><dd>{leader.trinkets}</dd></div><div><dt>Record scope</dt><dd>{hasCompleteLeaderCard(leader) ? "Public card" : "Base client record"}</dd></div><div><dt>Recorded version</dt><dd>{leader.gameVersion}</dd></div><div><dt>Last checked</dt><dd>{leader.lastVerified}</dd></div></dl>
        <h3>Explore</h3><Link href="#company-plan">Company starting point</Link>{leaderBuilds.length > 0 && <Link href="#build-notes">Editable build notes</Link>}<Link href="/wiki/leaders">All leaders</Link><Link href={`/wiki/factions/${leader.factionSlug}`}>{leader.faction}</Link><Link href="/updates">Patch notes</Link>
        <h3>Official game page</h3><a href={leader.source} target="_blank" rel="noreferrer">Official leader cards ↗</a>
      </aside>
    </div>
  </main>;
}
