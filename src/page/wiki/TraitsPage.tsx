import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { units } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata("Goodly Trials Traits", "Verified Goodly Trials unit traits, effects, source units, and version freshness for v0.300.", "/wiki/traits");

export default function TraitsPage() {
  return <main><section className={styles.hero}><div className={`container ${styles.heroContent}`}><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Traits" }]} /><p className={styles.eyebrow}>Verified identities · v0.300</p><h1>Goodly Trials Traits</h1><p>Traits ask for a different place or purpose. This first index includes only effects shown on public official unit cards.</p></div></section><section className="container section"><div className={styles.portalGrid}>{units.map((unit) => <Link className={styles.portalCard} key={unit.slug} href={`/wiki/units/${unit.slug}`}><span>✦</span><h2>{unit.trait.name}</h2><p>{unit.trait.effect}</p><b>On {unit.name} →</b></Link>)}</div><section className={styles.sectionBlock}><h2>Traits are not roles</h2><p>A trait can alter growth, income, spell damage, equipment value, or death interactions. It should be read beside a unit&apos;s skills, tactic, stats, and equipment slots—not converted into an unsupported fixed role.</p></section></section></main>;
}
