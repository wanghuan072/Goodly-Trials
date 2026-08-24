"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import UnitSprite from "@/components/content/UnitSprite";
import type { Unit } from "@/types/content";
import styles from "@/style/page/wiki/explorer.module.css";

export default function UnitExplorer({ units }: { units: Unit[] }) {
  const [faction, setFaction] = useState("All");
  const [tactic, setTactic] = useState("All");
  const [sort, setSort] = useState("name");

  const visibleUnits = useMemo(() => {
    return units
      .filter((unit) => faction === "All" || unit.faction === faction)
      .filter((unit) => tactic === "All" || unit.tactic.name === tactic)
      .toSorted((a, b) => sort === "name" ? a.name.localeCompare(b.name) : b.stats[sort as "str" | "agi" | "int"] - a.stats[sort as "str" | "agi" | "int"]);
  }, [faction, sort, tactic, units]);

  return (
    <div>
      <div className={`${styles.filters} ${styles.unitFilters}`}>
        <fieldset><legend>Faction</legend>{["All", "Goodly Folk", "Bone Host", "Belowborn"].map((value) => <button key={value} type="button" aria-pressed={faction === value} onClick={() => setFaction(value)}>{value}</button>)}</fieldset>
        <fieldset><legend>Tactic</legend>{["All", "Formation", "Backline", "Flanking"].map((value) => <button key={value} type="button" aria-pressed={tactic === value} onClick={() => setTactic(value)}>{value}</button>)}</fieldset>
        <label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name A–Z</option><option value="str">STR high to low</option><option value="agi">AGI high to low</option><option value="int">INT high to low</option></select></label>
      </div>
      <p className={styles.resultCount} aria-live="polite">{visibleUnits.length} unit{visibleUnits.length === 1 ? "" : "s"} found</p>
      {visibleUnits.length ? <div className={styles.recordList} aria-label="Unit records">{visibleUnits.map((unit) => <Link className={styles.unitRecord} key={unit.slug} href={`/wiki/units/${unit.slug}`}>
        <span className={styles.recordArt}><UnitSprite src={unit.image} color={unit.accent} large /></span>
        <span className={styles.recordTitle}><small>{unit.faction} · {unit.trait.name === "Base client record" ? "Base record" : "Public card"}</small><b>{unit.name}</b><em>{unit.trait.name} · {unit.tactic.name}</em></span>
        <span className={styles.recordStats}><i><small>HP</small>{unit.stats.hp}</i><i><small>ATK</small>{unit.stats.atk}</i><i><small>AR</small>{unit.stats.ar}</i><i><small>RNG</small>{unit.stats.rng}</i></span>
        <span className={styles.openRecord}>View details →</span>
      </Link>)}</div> : <div className={styles.empty}>No units match these filters.</div>}
    </div>
  );
}
