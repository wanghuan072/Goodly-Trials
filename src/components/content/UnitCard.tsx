import Link from "next/link";
import type { Unit } from "@/types/content";
import UnitSprite from "@/components/content/UnitSprite";
import styles from "@/style/content/cards.module.css";

export default function UnitCard({ unit }: { unit: Unit }) {
  return (
    <article className={styles.unitCard}>
      <Link className={styles.cardVisual} href={`/wiki/units/${unit.slug}`} aria-label={`View ${unit.name}`}>
        <span className={styles.cardGlow} style={{ background: unit.accent }} />
        <UnitSprite src={unit.image} color={unit.accent} large />
      </Link>
      <div className={styles.cardBody}>
        <p className={styles.eyebrow}>{unit.faction}</p>
        <h3><Link href={`/wiki/units/${unit.slug}`}>{unit.name}</Link></h3>
        <div className={styles.statLine} aria-label={`${unit.name} core stats`}>
          <span><b>STR</b> {unit.stats.str}</span>
          <span><b>AGI</b> {unit.stats.agi}</span>
          <span><b>INT</b> {unit.stats.int}</span>
        </div>
        <div className={styles.tags}><span>{unit.trait.name}</span><span>{unit.tactic.name}</span></div>
      </div>
    </article>
  );
}
