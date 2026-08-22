"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Item } from "@/types/content";
import styles from "@/style/page/wiki/explorer.module.css";

const typeGroups = ["All", "One-handed", "Two-handed", "Shield", "Trinket", "Spell", "Potion", "Gear"];

export default function ItemExplorer({ items }: { items: Item[] }) {
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("name");
  const visibleItems = useMemo(() => {
    return items.filter((item) => type === "All" || item.type.startsWith(type))
      .toSorted((a, b) => {
        if (sort === "name") return a.name.localeCompare(b.name);
        const aCost = a.cost ?? Number.POSITIVE_INFINITY;
        const bCost = b.cost ?? Number.POSITIVE_INFINITY;
        return sort === "cost-high" ? bCost - aCost : aCost - bCost;
      });
  }, [items, sort, type]);

  return (
    <div>
      <div className={`${styles.filters} ${styles.itemFilters}`}>
        <fieldset><legend>Gear type</legend>{typeGroups.map((value) => <button key={value} type="button" aria-pressed={type === value} onClick={() => setType(value)}>{value}</button>)}</fieldset>
        <label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name A–Z</option><option value="cost-low">Cost low to high</option><option value="cost-high">Cost high to low</option></select></label>
      </div>
      <p className={styles.resultCount} aria-live="polite">{visibleItems.length} verified gear record{visibleItems.length === 1 ? "" : "s"}</p>
      {visibleItems.length ? <div className={styles.recordList} aria-label="Verified gear records">{visibleItems.map((item) => <Link className={styles.itemRecord} key={item.slug} href={`/wiki/gear/${item.slug}`}>
        <span className={styles.itemArt}>{item.image ? <Image src={item.image} alt="" width={54} height={54} unoptimized={item.image.endsWith(".gif") || item.image.startsWith("http")} /> : <span aria-label="Official item art has not been published">?</span>}</span>
        <span className={styles.recordTitle}><small>{item.type} · {item.gameVersion}</small><b>{item.name}</b><em>{item.effects.slice(0, 2).join(" · ")}</em></span>
        <span className={styles.itemRequirement}><small>Requirement</small>{item.requirements ?? "None listed"}</span>
        <span className={styles.itemCost}><small>Cost</small>{item.cost === undefined ? "Not published" : `${item.cost}G`}</span>
        <span className={styles.openRecord}>View details →</span>
      </Link>)}</div> : <div className={styles.empty}>No verified gear records match these filters.</div>}
    </div>
  );
}
