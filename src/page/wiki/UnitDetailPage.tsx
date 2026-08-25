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
  leaders,
  units,
  updates,
} from "@/lib/data/game-content";
import { getCompatibleGear, getLeaderCompanyPlan } from "@/lib/data/editorial-recommendations";
import UnitSidebar from "@/page/wiki/components/UnitSidebar";
import type { Unit } from "@/types/game";
import styles from "@/style/page/wiki/detail.module.css";

function signed(value: number, suffix = "") {
  return `${value > 0 ? "+" : ""}${value}${suffix}`;
}

export default function UnitDetailPage({ unit }: { unit: Unit }) {
  const traitRecord = getTraitForUnit(unit.slug);
  const compatibleGear = getCompatibleGear(unit, items);
  const companyLeaders = leaders
    .filter((leader) => leader.factionSlug === unit.factionSlug)
    .filter((leader) => getLeaderCompanyPlan(leader, units).unitSlugs.includes(unit.slug))
    .slice(0, 4);
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
                {unit.cost !== undefined && <span>◉ {unit.cost}G</span>}
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
                <EntityLinks>{unit.summary}</EntityLinks> The values on this
                page are the base card values, before a leader, equipment, or
                battle effects change them. Its card lists{" "}
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
            <p>Base values shown before leader bonuses, equipment, and combat effects.</p>
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
              Trait &amp; Card Effects{traitRecord ? ": " : ""}
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
                <p><EntityLinks>{unit.trait.effect}</EntityLinks></p>
                {unit.trait.cap && <em>{unit.trait.cap}</em>}
              </div>
            </div>
            <h2 className={styles.subheading}>Skills / Tactics</h2>
            <div className={styles.skillList}>
              {(unit.baseEffects ?? []).map((effect) => (
                <div key={effect}>
                  <span>✥</span>
                  <h3>Card effect</h3>
                  <p><EntityLinks>{effect}</EntityLinks></p>
                  <small>Base unit</small>
                </div>
              ))}
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

          <div className={`${styles.panelPair} ${!compatibleGear.length ? styles.panelPairSingle : ""}`}>
            {compatibleGear.length > 0 && (
              <section
                className={`${styles.panel} ${styles.editorial}`}
                id="gear-fit"
              >
                <h2>Gear to Compare</h2>
                <p className={styles.disclaimer}>
                  These are compatible base-card comparisons, not a best-in-slot
                  ranking. Each item meets this unit&apos;s listed attributes and
                  fits its available slots before leader, shop, and combat
                  modifiers are applied.
                </p>
                <div className={styles.itemTiles}>
                  {compatibleGear.map(({ item, reason }) => (
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
                          <small>{reason} {item.effects.slice(0, 1).join("")}</small>
                        </Link>
                  ))}
                </div>
              </section>
            )}
            {!compatibleGear.length && (
              <section className={`${styles.panel} ${styles.editorial}`} id="gear-fit">
                <h2>Gear to Compare</h2>
                <p className={styles.disclaimer}>This base card has no compatible published gear at its current attributes and slot capacity. That is a base-card check, not proof that temporary run bonuses can never open an option.</p>
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

          {companyLeaders.length > 0 && (
            <section className={`${styles.panel} ${styles.editorial}`} id="company-context">
              <h2>Leader &amp; Company Context</h2>
              <p>These leader pages include {unit.name} in a linked company frame. They use a verified leader effect where one is available, otherwise a faction-role starting point; neither is a fixed team ranking.</p>
              <div className={styles.relatedGrid}>
                {companyLeaders.map((leader) => {
                  const plan = getLeaderCompanyPlan(leader, units);
                  return <Link key={leader.slug} href={`/wiki/leaders/${leader.slug}`}><b>{leader.name}{leader.epithet ? ` · ${leader.epithet}` : ""}</b><span>{plan.title}</span></Link>;
                })}
              </div>
            </section>
          )}

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
                          <small>{entry.cost ?? "—"}G · {entry.tactic.name}</small>
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
                    {entry.cost ?? "—"}G · {entry.tactic.name}
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

        <UnitSidebar
          unit={unit}
          hasCompatibleGear={compatibleGear.length > 0}
          hasCompanyLeaders={companyLeaders.length > 0}
          hasBuild={Boolean(build)}
          hasRelatedUpdates={relatedUpdates.length > 0}
        />
      </div>
    </main>
  );
}
