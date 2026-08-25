import Link from "next/link";
import UnitSprite from "@/components/content/UnitSprite";
import { hasCompleteUnitCard } from "@/lib/data/record-coverage";
import styles from "@/style/page/wiki/detail.module.css";
import type { Unit } from "@/types/game";

function signed(value: number, suffix = "") {
  return `${value > 0 ? "+" : ""}${value}${suffix}`;
}

export default function UnitSidebar({
  unit,
  hasCompatibleGear,
  hasCompanyLeaders,
  hasBuild,
  hasRelatedUpdates,
}: {
  unit: Unit;
  hasCompatibleGear: boolean;
  hasCompanyLeaders: boolean;
  hasBuild: boolean;
  hasRelatedUpdates: boolean;
}) {
  return (
    <aside className={styles.sideProfile}>
      <div className={styles.profileArt}>
        <UnitSprite src={unit.image} color={unit.accent} large />
      </div>
      <h2>{unit.name}</h2>
      <dl>
        <div><dt>Faction</dt><dd><Link href={`/wiki/factions/${unit.factionSlug}`}>{unit.faction}</Link></dd></div>
        <div><dt>Role</dt><dd>{unit.tactic.name}</dd></div>
        <div><dt>Cost</dt><dd>{unit.cost === undefined ? "Not listed" : `${unit.cost}G`}</dd></div>
        <div><dt>Gear</dt><dd>{unit.gear ?? "Not listed"}</dd></div>
        <div><dt>Trinkets</dt><dd>{unit.trinkets ?? "Not listed"}</dd></div>
        <div><dt>Record scope</dt><dd>{hasCompleteUnitCard(unit) ? "Verified base card" : "Partial record"}</dd></div>
        <div><dt>Recorded version</dt><dd>{unit.gameVersion}</dd></div>
        <div><dt>Last checked</dt><dd>{unit.lastVerified}</dd></div>
      </dl>

      <h3>Key Stats</h3>
      <dl className={styles.keyStats}>
        <div><dt>Health</dt><dd>{unit.stats.hp}</dd></div>
        <div><dt>Attack</dt><dd>{unit.stats.atk}</dd></div>
        <div><dt>Armor</dt><dd>{unit.stats.ar}</dd></div>
        <div><dt>Move</dt><dd>{signed(unit.stats.spd, "%")}</dd></div>
        <div><dt>Range</dt><dd>{unit.stats.rng}</dd></div>
      </dl>

      <h3>Quick Links</h3>
      <a href="#overview">⚓ Overview</a>
      <a href="#stats">⚔ Full stats</a>
      <a href="#abilities">✦ Skills / tactics</a>
      {hasCompatibleGear && <a href="#gear-fit">▣ Gear to compare</a>}
      <a href="#formation">♜ Position notes</a>
      {hasCompanyLeaders && <a href="#company-context">♛ Company context</a>}
      {hasBuild && <a href="#build">✥ Synergies</a>}
      {hasRelatedUpdates && <a href="#patch-history">◈ Patch history</a>}

      <h3>Primary Source</h3>
      <a href={unit.source} target="_blank" rel="noreferrer">Official units page ↗</a>
    </aside>
  );
}
