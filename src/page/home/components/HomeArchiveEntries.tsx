import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import UnitSprite from "@/components/content/UnitSprite";
import styles from "@/style/page/home/home.module.css";
import type { Item, Unit } from "@/types/game";

export function PanelTitle({
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

export function HomeUnitEntry({ unit }: { unit: Unit }) {
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

export function HomeItemEntry({ item }: { item: Item }) {
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
