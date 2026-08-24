import type { CSSProperties } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import HeroIntel from "@/components/content/HeroIntel";
import {
  builds,
  factions,
  guides,
  items,
  leaders,
  traits,
  units,
  updates,
} from "@/lib/data/game-content";
import styles from "@/style/page/archive/archive.module.css";

type SearchResult = {
  type: string;
  title: string;
  description: string;
  href: string;
};
const index: SearchResult[] = [
  ...units.map((unit) => ({
    type: "Unit",
    title: unit.name,
    description: `${unit.faction} · ${unit.cost ?? "—"}G · ${unit.tactic.name} · ${(unit.baseEffects ?? []).join(" ")}`,
    href: `/wiki/units/${unit.slug}`,
  })),
  ...items.map((item) => ({
    type: "Gear",
    title: item.name,
    description: `${item.type} · ${item.effects.join(" · ")}`,
    href: `/wiki/gear/${item.slug}`,
  })),
  ...traits.map((trait) => ({
    type: "Trait",
    title: trait.name,
    description: `${trait.effect} · Unit: ${trait.unitName}`,
    href: `/wiki/traits#${trait.slug}`,
  })),
  ...leaders.map((leader) => ({
    type: "Leader",
    title: `${leader.name} ${leader.epithet}`.trim(),
    description: `${leader.faction} · ${leader.trait.name} · ${leader.trait.effect}`,
    href: `/wiki/leaders/${leader.slug}`,
  })),
  ...factions.map((faction) => ({
    type: "Faction",
    title: faction.name,
    description: faction.summary,
    href: `/wiki/factions/${faction.slug}`,
  })),
  ...guides.map((guide) => ({
    type: "Guide",
    title: guide.title,
    description: guide.excerpt,
    href: `/guides/${guide.slug}`,
  })),
  ...builds.map((build) => ({
    type: "Build",
    title: build.title,
    description: build.summary,
    href: `/builds#${build.slug}`,
  })),
  ...updates.map((update) => ({
    type: "Update",
    title: `${update.version} · ${update.title}`,
    description: update.summary,
    href: `/updates#${update.slug}`,
  })),
];

export default function SearchPage({ query }: { query: string }) {
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? index.filter((entry) =>
        `${entry.title} ${entry.description} ${entry.type}`
          .toLowerCase()
          .includes(normalized),
      )
    : [];
  return (
    <main>
      <section className={styles.hero} style={{ "--hero-image": 'url("/images/game/hero-wiki-v3.webp")' } as CSSProperties}>
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Search" }]}
          />
          <p className={styles.eyebrow}>Search units, gear, guides, builds, and updates</p>
          <h1>Goodly Trials - Search Units, Gear &amp; Guides</h1>
          <p>
            Search the cards, gear, leaders, traits, factions, guides, builds,
            and patch notes collected on this site.
          </p>
          <HeroIntel eyebrow="Archive search" title="Search across the site" items={[{ value: units.length, label: "Units" }, { value: items.length, label: "Gear" }, { value: guides.length, label: "Guides" }, { value: builds.length, label: "Builds" }]} />
        </div>
      </section>
      <section className="container section">
        <form className={styles.quickAnswer} action="/search" role="search">
          <label htmlFor="search-results">
            <b>Search query</b>
          </label>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input
              id="search-results"
              name="q"
              defaultValue={query}
              style={{
                minHeight: 44,
                flex: 1,
                border: "1px solid var(--border-bronze)",
                background: "#0a0806",
                color: "var(--text-main)",
                paddingInline: 12,
              }}
            />
            <button className="button button-primary" type="submit">
              Search
            </button>
          </div>
        </form>
        <p style={{ margin: "22px 0", color: "var(--text-muted)" }}>
          {normalized
            ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query}”`
            : "Enter a unit, gear item, trait, leader, faction, guide, build, or version."}
        </p>
        <div className={styles.entryList}>
          {results.map((entry) => (
            <Link
              className={styles.entryRow}
              href={entry.href}
              key={`${entry.type}-${entry.href}`}
            >
              <span>{entry.type}</span>
              <div>
                <h2>{entry.title}</h2>
                <p>{entry.description}</p>
              </div>
              <b>Open →</b>
            </Link>
          ))}
        </div>
        {normalized && !results.length && (
          <div className={styles.sectionBlock}>
            <h2>No match yet</h2>
            <p>
              Try a faction, trait, gear type, stat abbreviation, guide topic,
              or patch version.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
