import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import HeroIntel from "@/components/content/HeroIntel";
import UnitSprite from "@/components/content/UnitSprite";
import UnitExplorer from "@/page/wiki/components/UnitExplorer";
import { factions, units } from "@/lib/data/game-content";
import { hasCompleteUnitCard } from "@/lib/data/record-coverage";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata(
  "Goodly Trials Units – Stats, Traits & Tactics",
  "Check Goodly Trials unit stats, traits, tactics, and equipment capacity before you place a company.",
  "/wiki/units",
);

export default function UnitsPage() {
  return (
    <main>
      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/game/screenshot-2.webp"
          alt="A varied fellowship assembling beneath the moon before a campaign"
          fill
          preload
          sizes="100vw"
        />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Wiki", href: "/wiki" },
              { label: "Units" },
            ]}
          />
          <p className={styles.eyebrow}>Unit archive · public cards and readable client records</p>
          <h1>Goodly Trials Units - Stats, Traits &amp; Tactics</h1>
          <p>
            Compare unit records before you buy, equip, or place a unit. Full
            public cards include their published trait and skills. Base client
            records keep verified stats and combat identity, while clearly
            marking text that is not yet available from a public card.
          </p>
          <HeroIntel
            eyebrow="Roster desk"
            title="Choose by role"
            items={[
              { label: "Unit cards", value: units.length },
              { label: "Factions", value: factions.length },
              { label: "Full cards", value: units.filter(hasCompleteUnitCard).length },
              { label: "Plan", value: "Tactics" },
            ]}
          />
        </div>
      </section>
      <section className="container section">
        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <UnitExplorer units={units} />
            <div className={styles.sectionBlock}>
              <h2>Understanding Unit Stats</h2>
              <div className={styles.statExplain}>
                <div>
                  <b>⚔</b>
                  <h3>Strength (STR)</h3>
                  <p>Drives physical power and frontline durability.</p>
                </div>
                <div>
                  <b>✦</b>
                  <h3>Agility (AGI)</h3>
                  <p>Supports speed, evasion, and critical potential.</p>
                </div>
                <div>
                  <b>▣</b>
                  <h3>Intelligence (INT)</h3>
                  <p>Shapes spell power, mana, and resource use.</p>
                </div>
                <div>
                  <b>✥</b>
                  <h3>Traits</h3>
              <p>Full trait text appears only when the public card itself provides it.</p>
                </div>
              </div>
            </div>
          </div>
          <aside className={styles.sidebar}>
            <h2>Unit cards</h2>
            {units.slice(0, 5).map((unit) => (
              <Link
                className={styles.sideUnit}
                key={unit.slug}
                href={`/wiki/units/${unit.slug}`}
              >
                <UnitSprite src={unit.image} color={unit.accent} />
                <span>
                  <b>{unit.name}</b>
                  <small>{unit.faction}</small>
                </span>
              </Link>
            ))}
            <h3>Faction Overview</h3>
            {factions.map((faction) => (
              <Link key={faction.slug} href={`/wiki/factions/${faction.slug}`}>
                {faction.name} · {faction.roster.length} known
              </Link>
            ))}
            <h3>Starting builds</h3>
            <Link href="/builds#goodly-knight-frontline-build">
              Goodly Knight Build
            </Link>
            <Link href="/builds#wizard-frostfall-build">
              Wizard Frostfall Build
            </Link>
            <Link href="/guides/formation-guide">Formation Guide</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
