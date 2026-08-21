"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Item } from "@/types/content";
import styles from "@/style/page/wiki/explorer.module.css";

const typeGroups = ["All", "One-handed", "Two-handed", "Shield", "Trinket", "Spell", "Potion"];

export default function ItemExplorer({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("name");
  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => !normalized || `${item.name} ${item.type} ${item.effects.join(" ")}`.toLowerCase().includes(normalized))
      .filter((item) => type === "All" || item.type.startsWith(type))
      .toSorted((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "cost-high" ? b.cost - a.cost : a.cost - b.cost);
  }, [items, query, sort, type]);

  return (
    <div>
      <div className={styles.filters}>
        <label className={styles.searchLabel}>Search items<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, type, effect…" /></label>
        <fieldset className={styles.wideFieldset}><legend>Item type</legend>{typeGroups.map((value) => <button key={value} type="button" aria-pressed={type === value} onClick={() => setType(value)}>{value}</button>)}</fieldset>
        <label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name A–Z</option><option value="cost-low">Cost low to high</option><option value="cost-high">Cost high to low</option></select></label>
      </div>
      <p className={styles.resultCount} aria-live="polite">{visibleItems.length} verified item{visibleItems.length === 1 ? "" : "s"}</p>
      {visibleItems.length ? <div className={styles.recordList} aria-label="Verified item records">{visibleItems.map((item) => <Link className={styles.itemRecord} key={item.slug} href={`/wiki/items/${item.slug}`}>
        <span className={styles.itemArt}><Image src={item.image} alt="" width={54} height={54} unoptimized={item.image.endsWith(".gif")} /></span>
        <span className={styles.recordTitle}><small>{item.type} · {item.gameVersion}</small><b>{item.name}</b><em>{item.effects.slice(0, 2).join(" · ")}</em></span>
        <span className={styles.itemRequirement}><small>Requirement</small>{item.requirements ?? "None listed"}</span>
        <span className={styles.itemCost}><small>Cost</small>{item.cost}G</span>
        <span className={styles.openRecord}>Open record →</span>
      </Link>)}</div> : <div className={styles.empty}>No verified items match these filters.</div>}
    </div>
  );
}
