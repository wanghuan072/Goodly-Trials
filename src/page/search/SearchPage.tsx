import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import mechanicsData from "@/data/game/mechanics.json";
import { builds, factions, guides, items, leaders, units, updates } from "@/lib/data/game-content";
import styles from "@/style/page/archive/archive.module.css";

type SearchResult = { type: string; title: string; description: string; href: string };
const index: SearchResult[] = [
  ...units.map((unit) => ({ type: "Unit", title: unit.name, description: `${unit.faction} · ${unit.trait.name} · ${unit.tactic.name}`, href: `/wiki/units/${unit.slug}` })),
  ...items.map((item) => ({ type: "Item", title: item.name, description: `${item.type} · ${item.effects.join(" · ")}`, href: `/wiki/items/${item.slug}` })),
  ...leaders.map((leader) => ({ type: "Leader", title: `${leader.name} ${leader.epithet}`.trim(), description: `${leader.faction} · ${leader.trait.name} · ${leader.trait.effect}`, href: "/wiki/leaders" })),
  ...factions.map((faction) => ({ type: "Faction", title: faction.name, description: faction.summary, href: `/wiki/factions/${faction.slug}` })),
  ...guides.map((guide) => ({ type: "Guide", title: guide.title, description: guide.excerpt, href: `/guides/${guide.slug}` })),
  ...builds.map((build) => ({ type: "Build", title: build.title, description: build.summary, href: `/builds#${build.slug}` })),
  ...updates.map((update) => ({ type: "Update", title: `${update.version} · ${update.title}`, description: update.summary, href: `/updates/${update.slug}` })),
  ...mechanicsData.map((entry) => ({ type: "Mechanic", title: entry.title, description: entry.summary, href: `/wiki/mechanics/${entry.slug}` })),
];

export default function SearchPage({ query }: { query: string }) {
  const normalized = query.trim().toLowerCase();
  const results = normalized ? index.filter((entry) => `${entry.title} ${entry.description} ${entry.type}`.toLowerCase().includes(normalized)) : [];
  return <main><section className={styles.hero}><div className={`container ${styles.heroContent}`}><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} /><p className={styles.eyebrow}>Field archive search</p><h1>Search the Wiki</h1><p>Search verified units, items, factions, mechanics, guides, builds, and updates.</p></div></section><section className="container section"><form className={styles.quickAnswer} action="/search" role="search"><label htmlFor="search-results"><b>Search query</b></label><div style={{ display: "flex", gap: 8, marginTop: 12 }}><input id="search-results" name="q" defaultValue={query} style={{ minHeight: 44, flex: 1, border: "1px solid var(--border-bronze)", background: "#0a0806", color: "var(--text-main)", paddingInline: 12 }} /><button className="button button-primary" type="submit">Search</button></div></form><p style={{ margin: "22px 0", color: "var(--text-muted)" }}>{normalized ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query}”` : "Enter a unit, item, faction, mechanic, guide, build, or version."}</p><div className={styles.entryList}>{results.map((entry) => <Link className={styles.entryRow} href={entry.href} key={`${entry.type}-${entry.href}`}><span>{entry.type}</span><div><h2>{entry.title}</h2><p>{entry.description}</p></div><b>Open →</b></Link>)}</div>{normalized && !results.length && <div className={styles.sectionBlock}><h2>No verified match</h2><p>Try a faction, trait, item type, stat abbreviation, or patch version. The search intentionally excludes unverified placeholder records.</p></div>}</section></main>;
}
