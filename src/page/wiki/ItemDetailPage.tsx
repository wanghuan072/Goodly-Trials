import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import EntityLinks from "@/components/content/EntityLinks";
import { builds, items, units } from "@/lib/data/game-content";
import type { Item } from "@/types/content";
import styles from "@/style/page/wiki/detail.module.css";

const unitMatches: Record<string, string[]> = {
  "iron-sword-of-brawn": ["goodly-knight", "portly-knight"],
  "iron-shield-of-brawn": ["goodly-knight", "portly-knight"],
  "bow-of-grace": ["archer"],
  "feather-charm-of-reflex": ["archer", "skeleton-dog"],
  "wand-of-wit": ["wizard"],
  "ruby-charm-of-wit": ["wizard"],
  "frostfall-of-lore": ["wizard"],
  "fire-palm-of-balance": ["wizard"],
};

export default function ItemDetailPage({ item }: { item: Item }) {
  const artworkPending = item.image?.endsWith("item-data-pending.svg");
  const matchedUnits = (unitMatches[item.slug] ?? [])
    .map((slug) => units.find((unit) => unit.slug === slug))
    .filter(Boolean);
  const relatedItems = items
    .filter(
      (entry) =>
        entry.slug !== item.slug &&
        (entry.type === item.type ||
          entry.type.split(" ")[0] === item.type.split(" ")[0]),
    )
    .slice(0, 3);
  const relatedBuilds = builds.filter((build) =>
    matchedUnits.some((unit) => unit?.slug === build.unitSlug),
  );
  return (
    <main className={`container ${styles.detailShell}`}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wiki", href: "/wiki" },
          { label: "Gear", href: "/wiki/gear" },
          { label: item.name },
        ]}
      />
      <header className={styles.itemHero}>
        <div className={styles.itemVisual}>
          {item.image ? (
            <Image
              src={item.image}
              alt={artworkPending ? `${item.name} artwork pending` : `${item.name} official game icon`}
              width={120}
              height={120}
              unoptimized={item.image.endsWith(".gif") || item.image.startsWith("http")}
            />
          ) : (
            <span aria-label="Official item art has not been published">Item art not published</span>
          )}
        </div>
        <div className={styles.itemCopy}>
          <span className={styles.badge}>{item.type}</span>
          <h1>{item.name}</h1>
          <div className={styles.badges}>
            <span>{item.cost === undefined ? "Cost not published" : `${item.cost}G`}</span>
            {item.requirements && <span>Requires {item.requirements}</span>}
          </div>
          <div className={styles.effectList}>
            {item.effects.map((effect) => (
              <span key={effect}>
                <EntityLinks>{effect}</EntityLinks>
              </span>
            ))}
          </div>
        </div>
      </header>
      <div className={styles.detailGrid}>
        <article className={styles.detailMain}>
          <section className={styles.panel}>
            <h2>Overview</h2>
            <p>
              {item.name} is a {item.type.toLowerCase()} item in Goodly Trials.
              Its price is {item.cost === undefined ? "not listed" : `${item.cost}G`}
              {item.requirements
                ? ` and its listed requirement is ${item.requirements}`
                : " with no requirement shown on the item page"}
              .
            </p>
          </section>
          <section className={styles.panel}>
            <h2>Requirements, Stats & Effects</h2>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Requirement</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{item.type}</td>
                  <td>{item.requirements ?? "Not listed"}</td>
                  <td>{item.cost === undefined ? "Not published" : `${item.cost}G`}</td>
                </tr>
              </tbody>
            </table>
            <ul>
              {item.effects.map((effect) => (
                <li key={effect}>
                  <EntityLinks>{effect}</EntityLinks>
                </li>
              ))}
            </ul>
          </section>
          {matchedUnits.length > 0 && (
            <section className={`${styles.panel} ${styles.editorial}`}>
              <h2>Editorial Unit Fit</h2>
              <p>
                Recommendation layer. Matching below is based on current public
                attributes and requirements, not a developer-authored tier list.
              </p>
              <div className={styles.relatedGrid}>
                {matchedUnits.map(
                  (unit) =>
                    unit && (
                      <Link key={unit.slug} href={`/wiki/units/${unit.slug}`}>
                        <b>{unit.name}</b>
                        <span>
                          {unit.faction} · {unit.stats.str}/{unit.stats.agi}/
                          {unit.stats.int} STR/AGI/INT
                        </span>
                      </Link>
                    ),
                )}
              </div>
            </section>
          )}
          {relatedBuilds.length > 0 && (
            <section className={`${styles.panel} ${styles.editorial}`}>
              <h2>Build Notes Using This Item</h2>
              <div className={styles.relatedGrid}>
                {relatedBuilds.map((build) => (
                  <Link key={build.slug} href={`/builds#${build.slug}`}>
                    <b>{build.title}</b>
                    <span>{build.difficulty} · Editable preset</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {relatedItems.length > 0 && (
            <section className={styles.panel}>
              <h2>Related Items</h2>
              <div className={styles.relatedGrid}>
                {relatedItems.map((entry) => (
                  <Link key={entry.slug} href={`/wiki/gear/${entry.slug}`}>
                    <b>{entry.name}</b>
                    <span>
                      {entry.type} · {entry.cost === undefined ? "Cost not published" : `${entry.cost}G`}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
        <aside className={styles.sideProfile}>
          <h2>Item profile</h2>
          <dl>
            <div>
              <dt>Type</dt>
              <dd>{item.type}</dd>
            </div>
            <div>
              <dt>Requirement</dt>
              <dd>{item.requirements ?? "Not listed"}</dd>
            </div>
            <div>
              <dt>Cost</dt>
              <dd>{item.cost === undefined ? "Not published" : `${item.cost}G`}</dd>
            </div>
          </dl>
          <h3>Explore</h3>
          <Link href="/wiki/gear">All gear</Link>
          <Link href="/wiki/units">All units</Link>
          <Link href="/builds">Build notes</Link>
          <h3>Official game page</h3>
          <a href={item.source} target="_blank" rel="noreferrer">
            Official item guide ↗
          </a>
        </aside>
      </div>
    </main>
  );
}
