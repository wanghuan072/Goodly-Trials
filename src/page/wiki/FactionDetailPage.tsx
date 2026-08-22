import type { CSSProperties } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import UnitCard from "@/components/content/UnitCard";
import UnitSprite from "@/components/content/UnitSprite";
import { siteConfig } from "@/config/site";
import { builds, factions, units } from "@/lib/data/game-content";
import type { Faction } from "@/types/content";
import styles from "@/style/page/wiki/detail.module.css";

export default function FactionDetailPage({ faction }: { faction: Faction }) {
  const verifiedUnits = units.filter(
    (unit) => unit.factionSlug === faction.slug,
  );
  const factionBuilds = builds.filter(
    (build) => build.faction === faction.name,
  );
  const rosterOnly = verifiedUnits.length === 0;
  return (
    <main className={`container ${styles.detailShell}`}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wiki", href: "/wiki" },
          { label: "Factions", href: "/wiki/factions" },
          { label: faction.name },
        ]}
      />
      <header
        className={styles.unitHero}
        style={{ "--unit-accent": faction.accent } as CSSProperties}
      >
        <div className={styles.unitArt}>
          <UnitSprite src={faction.image} color={faction.accent} large />
        </div>
        <div className={styles.heroCopy}>
          <p className="sr-only">Faction overview</p>
          <h1>{faction.name}</h1>
          <div className={styles.badges}>
            <span>Faction</span>
            <span>Latest patch {siteConfig.latestPatchVersion}</span>
            {rosterOnly && <span>Roster coverage only</span>}
            <span>Checked {siteConfig.lastVerified}</span>
          </div>
          <p className={styles.summary}>{faction.summary}</p>
          <p className={styles.quote}>{faction.playstyle}</p>
        </div>
      </header>
      <div className={styles.detailGrid}>
        <article className={styles.detailMain}>
          <section className={styles.panel}>
            <h2>How this faction plays</h2>
            <p>{faction.summary}</p>
            <p>
              <strong>Player reading:</strong> {faction.playstyle}
            </p>
          </section>
          <section className={styles.panel}>
            <h2>{rosterOnly ? "Confirmed roster; full cards pending" : "Roster names shown in the game material"}</h2>
            <p>
              {rosterOnly
                ? "The roster names below are confirmed in public game material, but complete public cards for this faction have not been documented. They intentionally remain names rather than empty detail links."
                : "These names appear in the current game material. A full unit card is linked only when its stats and abilities can be checked."}
            </p>
            <div className={styles.relatedGrid}>
              {faction.roster.map((name) => {
                const unit = units.find((entry) => entry.name === name);
                return unit ? (
                  <Link
                    className={styles.relatedUnit}
                    key={name}
                    href={`/wiki/units/${unit.slug}`}
                  >
                    <UnitSprite src={unit.image} color={unit.accent} />
                    <span className={styles.relatedUnitCopy}>
                      <b>{name}</b>
                      <small>
                        {unit.trait.name} · {unit.tactic.name} · View card →
                      </small>
                    </span>
                  </Link>
                ) : (
                  <div className={styles.feature} key={name}>
                    <small>Confirmed roster name</small>
                    <h3>{name}</h3>
                    <p>Full unit-card details are not publicly documented yet.</p>
                  </div>
                );
              })}
            </div>
          </section>
          {verifiedUnits.length > 0 && (
            <section className={styles.panel}>
              <h2>Unit cards in this faction</h2>
              <p>These links open the Units section because each card belongs to a unit, not to a separate faction page.</p>
              <div className={styles.relatedGrid}>
                {verifiedUnits.map((unit) => (
                  <UnitCard key={unit.slug} unit={unit} />
                ))}
              </div>
            </section>
          )}
          {factionBuilds.length > 0 && (
            <section className={`${styles.panel} ${styles.editorial}`}>
              <h2>Build and formation ideas</h2>
              <p>
                Player ideas, not official rankings. Each build labels the
                board-rule version used by the Builder.
              </p>
              {factionBuilds.map((build) => (
                <div key={build.slug}>
                  <h3>
                    <Link href={`/builds#${build.slug}`}>{build.title}</Link>
                  </h3>
                  <p>{build.summary}</p>
                </div>
              ))}
            </section>
          )}
          <section className={styles.panel}>
            <h2>What this page does not rank</h2>
            <p>
              A faction does not have one fixed strength across every mode.
              Rolled traits, shop items, version changes, and different rules
              can all change a plan. This site will not assign a permanent
              ranking without repeatable, mode-specific results.
            </p>
          </section>
        </article>
        <aside className={styles.sideProfile}>
          <h2>{faction.name}</h2>
          <dl>
            <div>
              <dt>Roster names shown</dt>
              <dd>{faction.roster.length} names</dd>
            </div>
            <div>
              <dt>Unit cards available</dt>
              <dd>{verifiedUnits.length}</dd>
            </div>
            <div>
              <dt>Coverage</dt>
              <dd>{rosterOnly ? "Roster only" : "Roster + cards"}</dd>
            </div>
          </dl>
          {verifiedUnits.length > 0 && <><h3>Units in this faction</h3>
          {verifiedUnits.map((unit) => (
            <Link href={`/wiki/units/${unit.slug}`} key={unit.slug}>
              {unit.name}
            </Link>
          ))}</>}
          <Link href="/wiki/units">All units</Link>
          <h3>Other factions</h3>
          {factions.filter((entry) => entry.slug !== faction.slug).map((entry) => (
            <Link href={`/wiki/factions/${entry.slug}`} key={entry.slug}>
              {entry.name} faction
            </Link>
          ))}
          <Link href="/guides/formation-guide">Formation guide</Link>
          <h3>Official game page</h3>
          <a
            href="https://goodlytrials.com/wiki/units"
            target="_blank"
            rel="noreferrer"
          >
            Official units page ↗
          </a>
        </aside>
      </div>
    </main>
  );
}
