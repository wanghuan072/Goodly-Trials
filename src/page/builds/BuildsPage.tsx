import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import UnitSprite from "@/components/content/UnitSprite";
import EntityLinks from "@/components/content/EntityLinks";
import { siteConfig } from "@/config/site";
import {
  activeBoardCells,
  BOARD_CELLS,
  BOARD_COLUMNS,
  BOARD_RULES_VERSION,
} from "@/lib/builder/board-rules";
import { builds, items, leaders, units } from "@/lib/data/game-content";
import JsonLd from "@/seo/JsonLd";
import { createMetadata } from "@/seo/metadata";
import type { Build, Item, Unit } from "@/types/content";
import ApplyBuildButton from "./ApplyBuildButton";
import styles from "@/style/page/builds/builds.module.css";

export const metadata = createMetadata(
  "Goodly Trials Builds – Editable Teams & Formation Ideas",
  "Browse editable Goodly Trials team builds with formation previews, unit cards, gear plans, strengths, trade-offs, and one-click Builder loading.",
  "/builds",
);

const unitBySlug = new Map(units.map((unit) => [unit.slug, unit]));
const itemBySlug = new Map(items.map((item) => [item.slug, item]));
const leaderBySlug = new Map(leaders.map((leader) => [leader.slug, leader]));

function BoardPreview({ build }: { build: Build }) {
  const activeCells = activeBoardCells(build.week);
  const placements = new Map(
    build.placements.map((placement) => [placement.slot, placement]),
  );

  return (
    <div
      className={styles.boardPreview}
      role="img"
      aria-label={`${build.title} week ${build.week} formation preview`}
    >
      {Array.from({ length: BOARD_CELLS }, (_, index) => {
        const placement = placements.get(index);
        const unit = placement ? unitBySlug.get(placement.unitSlug) : undefined;
        const row = String.fromCharCode(65 + Math.floor(index / BOARD_COLUMNS));
        const column = (index % BOARD_COLUMNS) + 1;
        return (
          <span
            className={`${styles.boardCell} ${activeCells.has(index) ? styles.activeCell : styles.lockedCell} ${unit ? styles.filledCell : ""}`}
            key={index}
            title={unit ? `${row}${column} · ${unit.name}` : `${row}${column}`}
          >
            <small>
              {row}
              {column}
            </small>
            {unit && (
              <>
                <UnitSprite src={unit.image} color={unit.accent} />
                <b>{unit.name}</b>
              </>
            )}
          </span>
        );
      })}
    </div>
  );
}

function MemberCard({ unit, itemSlugs }: { unit: Unit; itemSlugs: string[] }) {
  const loadout = itemSlugs
    .map((slug) => itemBySlug.get(slug))
    .filter((item): item is Item => item !== undefined);
  return (
    <li className={styles.memberCard}>
      <UnitSprite src={unit.image} color={unit.accent} />
      <div>
        <small>{unit.tactic.name}</small>
        <strong>
          <Link href={`/wiki/units/${unit.slug}`}>{unit.name}</Link>
        </strong>
        <span>
          <EntityLinks>{unit.trait.name}</EntityLinks>
        </span>
      </div>
      <span className={styles.memberItems}>
        {loadout.length ? (
          loadout.map((item) => (
            <Link href={`/wiki/gear/${item.slug}`} key={item.slug}>
              <Image
                src={item.image}
                alt={item.name}
                title={item.name}
                width={28}
                height={28}
                unoptimized={item.image.endsWith(".gif") || item.image.startsWith("http")}
              />
            </Link>
          ))
        ) : (
          <em>No preset items</em>
        )}
      </span>
    </li>
  );
}

function BuildCard({ build }: { build: Build }) {
  const leader = leaderBySlug.get(build.leaderSlug);
  const memberEntries = build.placements
    .map((placement) => ({
      placement,
      unit: unitBySlug.get(placement.unitSlug),
    }))
    .filter(
      (
        entry,
      ): entry is { placement: Build["placements"][number]; unit: Unit } =>
        entry.unit !== undefined,
    );
  const itemCost = build.placements.reduce(
    (total, placement) =>
      total +
      placement.itemSlugs.reduce(
        (subtotal, slug) => subtotal + (itemBySlug.get(slug)?.cost ?? 0),
        0,
      ),
    0,
  );

  return (
    <article className={styles.buildCard} id={build.slug}>
      <header className={styles.buildHeader}>
        <div className={styles.buildIndex}>
          <span>{String(builds.indexOf(build) + 1).padStart(2, "0")}</span>
          <small>Preset</small>
        </div>
        <div>
          <p>
            {build.faction} · {build.difficulty}
          </p>
          <h2>{build.title}</h2>
          <span>
            <EntityLinks>{build.summary}</EntityLinks>
          </span>
        </div>
        <dl>
          <div>
            <dt>Mode</dt>
            <dd>{build.mode}</dd>
          </div>
          <div>
            <dt>Week</dt>
            <dd>{build.week}</dd>
          </div>
          <div>
            <dt>Followers</dt>
            <dd>{memberEntries.length}</dd>
          </div>
          <div>
            <dt>Known item cost</dt>
            <dd>{itemCost}G</dd>
          </div>
        </dl>
      </header>

      <div className={styles.buildBody}>
        <section
          className={styles.previewPanel}
          aria-label={`${build.title} company preview`}
        >
          <div className={styles.leaderBar}>
            <span>{leader?.name.slice(0, 1) ?? "?"}</span>
            <div>
              <small>{leader?.faction ?? build.faction} leader</small>
              <strong>
                {leader ? (
                  <Link href={`/wiki/leaders/${leader.slug}`}>
                    {leader.name}
                  </Link>
                ) : (
                  "Leader unavailable"
                )}
              </strong>
              <em>{leader?.trait.name ?? "Public data pending"}</em>
            </div>
          </div>
          <BoardPreview build={build} />
          <p>
            <strong>Best for</strong>
            {build.bestFor}
          </p>
        </section>

        <section className={styles.buildAnalysis}>
          <div className={styles.analysisColumns}>
            <div className={styles.strengths}>
              <h3>
                <span>+</span> Strengths
              </h3>
              <ul>
                {build.strengths.map((strength) => (
                  <li key={strength}>
                    <EntityLinks>{strength}</EntityLinks>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.weaknesses}>
              <h3>
                <span>−</span> Weaknesses
              </h3>
              <ul>
                {build.weaknesses.map((weakness) => (
                  <li key={weakness}>
                    <EntityLinks>{weakness}</EntityLinks>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.rosterBlock}>
            <h3>Company roster & preset equipment</h3>
            <ul>
              {memberEntries.map(({ placement, unit }) => (
                <MemberCard
                  key={`${placement.slot}-${unit.slug}`}
                  unit={unit}
                  itemSlugs={placement.itemSlugs}
                />
              ))}
            </ul>
          </div>
        </section>
      </div>

      <footer className={styles.buildFooter}>
        <p>
          <strong>Planning note:</strong>{" "}
          <EntityLinks>{build.planningNote}</EntityLinks>
          <span>
            {build.version} · player build · check against the live game
          </span>
        </p>
        <div>
          <small>
            Applying this preset replaces the current local Builder draft.
          </small>
          <ApplyBuildButton build={build} />
        </div>
      </footer>
    </article>
  );
}

export default function BuildsPage() {
  return (
    <main className={styles.page}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Goodly Trials team builds and company presets",
          description:
            "Editable Goodly Trials formation presets with visible strengths, weaknesses, rosters, and equipment plans.",
          numberOfItems: builds.length,
          itemListElement: builds.map((build, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: build.title,
            url: `${siteConfig.url}/builds#${build.slug}`,
          })),
        }}
      />
      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/game/screenshot-1.webp"
          alt="Goodly Trials formation board with unit cards, shop records, and an inspection panel"
          fill
          preload
          sizes="100vw"
        />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "Builds" }]}
            />
            <p className={styles.eyebrow}>
              Editable starting ideas · board rules last verified for {BOARD_RULES_VERSION}
            </p>
            <h1>Company Builds</h1>
            <p>
              Start with a complete formation instead of a loose unit idea. Each
              build shows a board, roster, gear goals, strengths, and trade-offs,
              then opens in the Builder so you can change it for your own run.
            </p>
            <div className={styles.heroActions}>
              <a href="#team-builds">Browse {builds.length} presets</a>
              <Link href="/builder">Start an empty company</Link>
            </div>
          </div>
          <figure className={styles.heroStage}>
            <Image
              className={styles.heroStageImage}
              src="/images/game/screenshot-1.webp"
              alt="Official Goodly Trials formation board with unit cards and inspect panel"
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
            />
            <figcaption>Official game board · formation and inspect</figcaption>
          </figure>
        </div>
      </section>

      <section className={`container ${styles.libraryIntro}`}>
        <div>
          <p className={styles.eyebrow}>From idea to board</p>
          <h2>Choose a starting point, then make it yours.</h2>
        </div>
        <p>
          These are player-made starting ideas, not official developer builds
          or permanent meta claims. The one-click action loads the
          visible leader, week, units, positions, compatible public item
          examples, and planning note into the Builder, where every part remains
          movable or removable.
        </p>
        <dl>
          <div>
            <dt>{builds.length}</dt>
            <dd>editable presets</dd>
          </div>
          <div>
            <dt>{units.length}</dt>
            <dd>complete unit cards</dd>
          </div>
          <div>
            <dt>{items.length}</dt>
            <dd>gear examples</dd>
          </div>
        </dl>
      </section>

      <section
        className={`container ${styles.buildLibrary}`}
        id="team-builds"
        aria-label="Goodly Trials team build presets"
      >
        {builds.map((build) => (
          <BuildCard build={build} key={build.slug} />
        ))}
      </section>

      <aside className={`container ${styles.disclosure}`}>
        <strong>How to use these builds</strong>
        <p>
          Placement limits use the Builder&apos;s rules last verified for {BOARD_RULES_VERSION}. Unit and gear cards
          keep the game version shown on their own pages. Strengths and
          weaknesses explain the idea behind each setup; no build promises a win,
          a shop roll, or a combat result.
        </p>
        <Link href="/builder">Build your own company →</Link>
      </aside>
    </main>
  );
}
