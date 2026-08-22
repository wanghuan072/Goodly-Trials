import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import UnitSprite from "@/components/content/UnitSprite";
import UnitExplorer from "@/page/wiki/components/UnitExplorer";
import { factions, units } from "@/lib/data/game-content";
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
          src="/images/game/hero-battlefield-v2.webp"
          alt="Pixel-art company facing enemy formations across a moonlit tactical battlefield"
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
          <p className={styles.eyebrow}>Unit cards · stats, traits, and tactics</p>
          <h1>Units &amp; Tactics</h1>
          <p>
            Compare the cards currently shown here before you buy, equip, or
            place a unit. Filter by faction, tactic, and core attributes, then
            open a card when you need the full details.
          </p>
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
                  <p>Define the rolled advantages that distinguish recruits.</p>
                </div>
              </div>
              <p>
                This list includes the complete cards currently available to
                inspect. Other roster names stay name-only until their card
                details are visible in the game material.
              </p>
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
