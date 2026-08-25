import Image from "next/image";
import Link from "next/link";
import EntityLinks from "@/components/content/EntityLinks";
import UnitSprite from "@/components/content/UnitSprite";
import {
  activeBoardCells,
  BOARD_CELLS,
  BOARD_COLUMNS,
} from "@/lib/builder/board-rules";
import { items, leaders, units } from "@/lib/data/game-content";
import ApplyBuildButton from "@/page/builds/ApplyBuildButton";
import styles from "@/style/page/builds/builds.module.css";
import type { Build } from "@/types/build";
import type { Item, Unit } from "@/types/game";

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
            <small>{row}{column}</small>
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
        <strong><Link href={`/wiki/units/${unit.slug}`}>{unit.name}</Link></strong>
        <span>
          <EntityLinks>{unit.baseEffects?.[0] ?? "Base card details available in the wiki."}</EntityLinks>
        </span>
      </div>
      <span className={styles.memberItems}>
        {loadout.length ? loadout.map((item) => (
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
        )) : <em>Choose gear in Builder</em>}
      </span>
    </li>
  );
}

export default function BuildCard({ build, index }: { build: Build; index: number }) {
  const leader = leaderBySlug.get(build.leaderSlug);
  const memberEntries = build.placements
    .map((placement) => ({
      placement,
      unit: unitBySlug.get(placement.unitSlug),
    }))
    .filter(
      (entry): entry is { placement: Build["placements"][number]; unit: Unit } =>
        entry.unit !== undefined,
    );
  const itemCost = build.placements.reduce(
    (total, placement) => total + placement.itemSlugs.reduce(
      (subtotal, slug) => subtotal + (itemBySlug.get(slug)?.cost ?? 0),
      0,
    ),
    0,
  );

  return (
    <article className={styles.buildCard} id={build.slug}>
      <header className={styles.buildHeader}>
        <div className={styles.buildIndex}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <small>Preset</small>
        </div>
        <div>
          <p>{build.faction} · {build.difficulty}</p>
          <h2>{build.title}</h2>
          <span><EntityLinks>{build.summary}</EntityLinks></span>
        </div>
        <dl>
          <div><dt>Mode</dt><dd>{build.mode}</dd></div>
          <div><dt>Week</dt><dd>{build.week}</dd></div>
          <div><dt>Followers</dt><dd>{memberEntries.length}</dd></div>
          <div><dt>Known item cost</dt><dd>{itemCost}G</dd></div>
        </dl>
      </header>

      <div className={styles.buildBody}>
        <section className={styles.previewPanel} aria-label={`${build.title} company preview`}>
          <div className={styles.leaderBar}>
            <span>{leader?.name.slice(0, 1) ?? "?"}</span>
            <div>
              <small>{leader?.faction ?? build.faction} leader</small>
              <strong>
                {leader ? <Link href={`/wiki/leaders/${leader.slug}`}>{leader.name}</Link> : "Leader unavailable"}
              </strong>
              <em>{leader?.trait.name ?? "Public data pending"}</em>
            </div>
          </div>
          <BoardPreview build={build} />
          <p><strong>Best for</strong>{build.bestFor}</p>
        </section>

        <section className={styles.buildAnalysis}>
          <div className={styles.analysisColumns}>
            <div className={styles.strengths}>
              <h3><span>+</span> Strengths</h3>
              <ul>{build.strengths.map((strength) => <li key={strength}><EntityLinks>{strength}</EntityLinks></li>)}</ul>
            </div>
            <div className={styles.weaknesses}>
              <h3><span>−</span> Weaknesses</h3>
              <ul>{build.weaknesses.map((weakness) => <li key={weakness}><EntityLinks>{weakness}</EntityLinks></li>)}</ul>
            </div>
          </div>
          <div className={styles.rosterBlock}>
            <h3>Company roster &amp; preset equipment</h3>
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
          <strong>Planning note:</strong>{" "}<EntityLinks>{build.planningNote}</EntityLinks>
          <span>Editable company preset</span>
        </p>
        <div>
          <small>Applying this preset replaces the current local Builder draft.</small>
          <ApplyBuildButton build={build} />
        </div>
      </footer>
    </article>
  );
}
