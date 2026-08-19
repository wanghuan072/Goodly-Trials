"use client";

import { useMemo, useState } from "react";
import UnitCard from "@/components/content/UnitCard";
import type { Unit } from "@/types/content";
import styles from "@/style/page/wiki/explorer.module.css";

export default function UnitExplorer({ units }: { units: Unit[] }) {
  const [query, setQuery] = useState("");
  const [faction, setFaction] = useState("All");
  const [tactic, setTactic] = useState("All");
  const [sort, setSort] = useState("name");

  const visibleUnits = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return units
      .filter((unit) => !normalized || `${unit.name} ${unit.faction} ${unit.trait.name} ${unit.tactic.name}`.toLowerCase().includes(normalized))
      .filter((unit) => faction === "All" || unit.faction === faction)
      .filter((unit) => tactic === "All" || unit.tactic.name === tactic)
      .toSorted((a, b) => sort === "name" ? a.name.localeCompare(b.name) : b.stats[sort as "str" | "agi" | "int"] - a.stats[sort as "str" | "agi" | "int"]);
  }, [faction, query, sort, tactic, units]);

  return (
    <div>
      <div className={styles.filters}>
        <label className={styles.searchLabel}>Search units<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, trait, tactic…" /></label>
        <fieldset><legend>Faction</legend>{["All", "Goodly Folk", "Bone Host", "Belowborn"].map((value) => <button key={value} type="button" aria-pressed={faction === value} onClick={() => setFaction(value)}>{value}</button>)}</fieldset>
        <fieldset><legend>Tactic</legend>{["All", "Formation", "Backline", "Flanking"].map((value) => <button key={value} type="button" aria-pressed={tactic === value} onClick={() => setTactic(value)}>{value}</button>)}</fieldset>
        <label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name A–Z</option><option value="str">STR high to low</option><option value="agi">AGI high to low</option><option value="int">INT high to low</option></select></label>
      </div>
      <p className={styles.resultCount} aria-live="polite">{visibleUnits.length} verified unit{visibleUnits.length === 1 ? "" : "s"}</p>
      {visibleUnits.length ? <div className={styles.unitGrid}>{visibleUnits.map((unit) => <UnitCard key={unit.slug} unit={unit} />)}</div> : <div className={styles.empty}>No verified units match these filters.</div>}
    </div>
  );
}
