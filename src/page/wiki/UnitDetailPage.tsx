import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import UnitSprite from "@/components/content/UnitSprite";
import EntityLinks from "@/components/content/EntityLinks";
import {
  builds,
  getTraitForUnit,
  items,
  units,
  updates,
} from "@/lib/data/game-content";
import type { Unit } from "@/types/content";
import styles from "@/style/page/wiki/detail.module.css";

const itemRecommendations: Record<string, string[]> = {
  "goodly-knight": ["iron-sword-of-brawn", "iron-shield-of-brawn"],
  "portly-knight": ["iron-sword-of-brawn", "iron-shield-of-brawn"],
  archer: ["bow-of-grace", "feather-charm-of-reflex"],
  wizard: ["wand-of-wit", "frostfall-of-lore"],
  "skeleton-child": ["iron-sword-of-brawn", "iron-shield-of-brawn"],
};

function signed(value: number, suffix = "") {
  return `${value > 0 ? "+" : ""}${value}${suffix}`;
}

export default function UnitDetailPage({ unit }: { unit: Unit }) {
  const traitRecord = getTraitForUnit(unit.slug);
  const recommendedItems = (itemRecommendations[unit.slug] ?? [])
    .map((slug) => items.find((item) => item.slug === slug))
    .filter(Boolean);
  const build = builds.find((entry) => entry.unitSlug === unit.slug);
  const relatedUnits = units
    .filter(
      (entry) =>
        entry.slug !== unit.slug && entry.factionSlug === unit.factionSlug,
    )
    .slice(0, 4);
  const relatedUpdates = updates
    .filter((update) => {
      const updateText = `${update.summary} ${update.impact}`.toLowerCase();
      return updateText.includes(unit.name.toLowerCase());
    })
    .slice(0, 3);

  return (
    <main className={`container ${styles.detailShell}`}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wiki", href: "/wiki" },
          { label: "Units", href: "/wiki/units" },
          { label: unit.name },
        ]}
      />
      <div className={styles.detailGrid}>
        <article className={styles.detailMain}>
          <header
            className={styles.unitHero}
            style={{ "--unit-accent": unit.accent } as CSSProperties}
          >
            <div className={styles.unitArt}>
              <UnitSprite src={unit.image} color={unit.accent} large />
            </div>
            <div className={styles.heroCopy}>
              <h1>{unit.name}</h1>
              <div className={styles.badges}>
                <span>♜ {unit.faction}</span>
                <span>◈ {unit.tactic.name}</span>
              </div>
              <p className={styles.summary}>
                <EntityLinks>{unit.summary}</EntityLinks>
              </p>
              <dl className={styles.statStrip}>
                {[
                  ["Health", unit.stats.hp],
                  ["Attack", unit.stats.atk],
                  ["Armor", unit.stats.ar],
                  ["Critical", `${unit.stats.crt}%`],
                  ["Speed", signed(unit.stats.spd, "%")],
                  ["Range", unit.stats.rng],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </header>

          <section className={styles.panel} id="overview">
            <h2>Overview</h2>
            <div className={styles.overviewBody}>
              <UnitSprite src={unit.image} color={unit.accent} />
              <p>
                <EntityLinks>{unit.summary}</EntityLinks> Its card lists{" "}
                <strong>
                  <EntityLinks>{unit.tactic.name}</EntityLinks>
                </strong>{" "}
                as its battlefield tactic. Any player advice on this page is
                kept separate from the card text.
              </p>
            </div>
          </section>

          <section className={styles.panel} id="stats">
            <h2>Full Stats</h2>
            <div className={styles.tableScroll}>
              <table className={styles.statsTable}>
                <thead>
                  <tr>
                    <th>ES</th>
                    <th>HP</th>
                    <th>MP</th>
                    <th>STR</th>
                    <th>AGI</th>
                    <th>INT</th>
                    <th>ATK</th>
                    <th>CRT</th>
                    <th>RNG</th>
                    <th>SPD</th>
                    <th>AR</th>
                    <th>EVA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{unit.stats.es}</td>
                    <td>{unit.stats.hp}</td>
                    <td>{unit.stats.mp}</td>
                    <td>{unit.stats.str}</td>
                    <td>{unit.stats.agi}</td>
                    <td>{unit.stats.int}</td>
                    <td>{unit.stats.atk}</td>
                    <td>{unit.stats.crt}%</td>
                    <td>{unit.stats.rng}</td>
                    <td>{signed(unit.stats.spd, "%")}</td>
                    <td>{unit.stats.ar}</td>
                    <td>{unit.stats.eva}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.panel} id="abilities">
            <h2>
              Trait:{" "}
              {traitRecord ? (
                <Link href={`/wiki/traits#${traitRecord.slug}`}>
                  {unit.trait.name}
                </Link>
              ) : (
                unit.trait.name
              )}
            </h2>
            <div className={styles.traitBody}>
              <span>✥</span>
              <div>
                <p>
                  <EntityLinks>{unit.trait.effect}</EntityLinks>
                </p>
                {unit.trait.cap && <em>{unit.trait.cap}</em>}
              </div>
            </div>
            <h2 className={styles.subheading}>Skills / Tactics</h2>
            <div className={styles.skillList}>
              {unit.skills.map((skill) => (
                <div key={skill.name}>
                  <span>✦</span>
                  <h3>{skill.name}</h3>
                  <p>
                    <EntityLinks>{skill.effect}</EntityLinks>
                  </p>
                  <small>Unit skill</small>
                </div>
              ))}
              <div>
                <span>♜</span>
                <h3>
                  <EntityLinks>{unit.tactic.name}</EntityLinks>
                </h3>
                <p>
                  <EntityLinks>{unit.tactic.effect}</EntityLinks>
                </p>
                <small>Battlefield tactic</small>
              </div>
            </div>
          </section>

          <div
            className={`${styles.panelPair} ${!recommendedItems.length ? styles.panelPairSingle : ""}`}
          >
            {recommendedItems.length > 0 && (
              <section
                className={`${styles.panel} ${styles.editorial}`}
                id="items"
              >
                <h2>Editorial Item Starting Points</h2>
                <p className={styles.disclaimer}>
                  Independent pairing based on published requirements and effects;
                  not an official or universal best-in-slot claim.
                </p>
                <div className={styles.itemTiles}>
                  {recommendedItems.map(
                    (item) =>
                      item && (
                        <Link key={item.slug} href={`/wiki/gear/${item.slug}`}>
                          <Image
                            className={styles.itemTileImage}
                            src={item.image}
                            alt=""
                            width={36}
                            height={36}
                            unoptimized={item.image.endsWith(".gif") || item.image.startsWith("http")}
                          />
                          <span>{item.name}</span>
                          <small>{item.effects.slice(0, 1).join("")}</small>
                        </Link>
                      ),
                  )}
                </div>
              </section>
            )}
            <section
              className={`${styles.panel} ${styles.editorial}`}
              id="formation"
            >
              <h2>Editorial Position Notes</h2>
              <div className={styles.formation}>
                <div className={styles.formationBoard}>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i className={styles.activeTile} />
                  <i />
                  <i />
                  <i />
                </div>
                <p>
                  <strong>{unit.tactic.name}:</strong> {unit.tactic.effect}{" "}
                  {unit.tactic.name === "Formation"
                    ? "Keep adjacency visible before locking the line."
                    : unit.tactic.name === "Backline"
                      ? "Protect the unit from early contact and confirm range."
                      : "Check opposing corners and avoid assuming a flank is guaranteed."}
                </p>
              </div>
            </section>
          </div>

          {(build || relatedUpdates.length > 0) && (
            <div
              className={`${styles.panelPair} ${!build || !relatedUpdates.length ? styles.panelPairSingle : ""}`}
            >
              {build && (
                <section
                  className={`${styles.panel} ${styles.editorial}`}
                  id="build"
                >
                  <h2>Synergies</h2>
                  <div className={styles.relatedGrid}>
                    <Link href={`/builds#${build.slug}`}>
                      <b>{build.title}</b>
                      <span>{build.summary}</span>
                    </Link>
                    {relatedUnits.slice(0, 2).map((entry) => (
                      <Link
                        className={styles.relatedUnit}
                        key={entry.slug}
                        href={`/wiki/units/${entry.slug}`}
                      >
                        <UnitSprite src={entry.image} color={entry.accent} />
                        <span className={styles.relatedUnitCopy}>
                          <b>{entry.name}</b>
                          <small>
                            {entry.trait.name} · {entry.tactic.name}
                          </small>
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              {relatedUpdates.length > 0 && (
                <section className={styles.panel} id="patch-history">
                  <h2>Patch History</h2>
                  {relatedUpdates.map((update) => (
                    <div className={styles.patchRow} key={update.slug}>
                      <Link href={`/updates#${update.slug}`}>
                        {update.version}
                      </Link>
                      <span>{update.date}</span>
                      <p>{update.summary}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>
          )}

          <section className={styles.panel}>
            <h2>Related Guides</h2>
            <div className={styles.relatedGrid}>
              {relatedUnits.map((entry) => (
                <Link key={entry.slug} href={`/wiki/units/${entry.slug}`}>
                  <b>{entry.name}</b>
                  <span>
                    {entry.trait.name} · {entry.tactic.name}
                  </span>
                </Link>
              ))}
              <Link href="/guides/formation-guide">
                <b>Formation Guide</b>
                <span>Positioning and flanking fundamentals.</span>
              </Link>
              <Link href="/guides/beginners-guide">
                <b>Beginner&apos;s Guide</b>
                <span>Read the card before buying or placing.</span>
              </Link>
            </div>
          </section>
        </article>

        <aside className={styles.sideProfile}>
          <div className={styles.profileArt}>
            <UnitSprite src={unit.image} color={unit.accent} large />
          </div>
          <h2>{unit.name}</h2>
          <dl>
            <div>
              <dt>Faction</dt>
              <dd>
                <Link href={`/wiki/factions/${unit.factionSlug}`}>
                  {unit.faction}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{unit.tactic.name}</dd>
            </div>
            <div>
              <dt>Gear</dt>
              <dd>{unit.gear ?? "Not listed"}</dd>
            </div>
            <div>
              <dt>Trinkets</dt>
              <dd>{unit.trinkets ?? "Not listed"}</dd>
            </div>
          </dl>
          <h3>Key Stats</h3>
          <dl className={styles.keyStats}>
            <div>
              <dt>Health</dt>
              <dd>{unit.stats.hp}</dd>
            </div>
            <div>
              <dt>Attack</dt>
              <dd>{unit.stats.atk}</dd>
            </div>
            <div>
              <dt>Armor</dt>
              <dd>{unit.stats.ar}</dd>
            </div>
            <div>
              <dt>Move</dt>
              <dd>{signed(unit.stats.spd, "%")}</dd>
            </div>
            <div>
              <dt>Range</dt>
              <dd>{unit.stats.rng}</dd>
            </div>
          </dl>
          <h3>Quick Links</h3>
          <a href="#overview">⚓ Overview</a>
          <a href="#stats">⚔ Full stats</a>
          <a href="#abilities">✦ Skills / tactics</a>
          {recommendedItems.length > 0 && <a href="#items">▣ Item notes</a>}
          <a href="#formation">♜ Position notes</a>
          {build && <a href="#build">✥ Synergies</a>}
          {relatedUpdates.length > 0 && (
            <a href="#patch-history">◈ Patch history</a>
          )}
          <h3>Primary Source</h3>
          <a href={unit.source} target="_blank" rel="noreferrer">
            Official units page ↗
          </a>
        </aside>
      </div>
    </main>
  );
}
