"use client";

import { useMemo, useState } from "react";
import ItemCard from "@/components/content/ItemCard";
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
      {visibleItems.length ? <div className={styles.itemGrid}>{visibleItems.map((item) => <ItemCard key={item.slug} item={item} />)}</div> : <div className={styles.empty}>No verified items match these filters.</div>}
    </div>
  );
}
