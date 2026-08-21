"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "@/style/page/wiki/wiki-list.module.css";

export type WikiRecord = {
  id: string;
  kind: "Unit" | "Item" | "Leader" | "Mechanic" | "Faction" | "Trait" | "Ascendancy";
  title: string;
  meta: string;
  description: string;
  href: string;
  verified: string;
};

const kinds: WikiRecord["kind"][] = ["Unit", "Item", "Leader", "Mechanic", "Faction", "Trait", "Ascendancy"];

export default function WikiRecordList({ records }: { records: WikiRecord[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"All" | WikiRecord["kind"]>("All");
  const visibleRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return records.filter((record) => kind === "All" || record.kind === kind)
      .filter((record) => !normalized || `${record.title} ${record.meta} ${record.description} ${record.kind}`.toLowerCase().includes(normalized));
  }, [kind, query, records]);

  return <>
    <div className={styles.filters}>
      <label>Search all records<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, effect, stat, faction…" /></label>
      <fieldset><legend>Record type</legend><button type="button" aria-pressed={kind === "All"} onClick={() => setKind("All")}>All</button>{kinds.map((value) => <button type="button" key={value} aria-pressed={kind === value} onClick={() => setKind(value)}>{value}</button>)}</fieldset>
    </div>
    <p className={styles.count} aria-live="polite">{visibleRecords.length} verified record{visibleRecords.length === 1 ? "" : "s"}</p>
    {visibleRecords.length ? <div className={styles.list}>{visibleRecords.map((record) => <Link className={styles.row} href={record.href} key={record.id}>
      <span className={styles.kind}>{record.kind}</span>
      <div><small>{record.meta} · verified {record.verified}</small><h2>{record.title}</h2><p>{record.description}</p></div>
      <b>Open →</b>
    </Link>)}</div> : <div className={styles.empty}>No verified records match this search.</div>}
  </>;
}
