import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import HeroIntel from "@/components/content/HeroIntel";
import { getUnit, traits } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata(
  "Goodly Trials Traits – Effects, Caps & Unit Cards",
  "Check Goodly Trials trait effects, listed caps, and the unit cards that carry them.",
  "/wiki/traits",
);

function tacticGuide(tactic: string) {
  return tactic === "Flanking"
    ? { href: "/guides/formation-guide", label: "Flanking" }
    : {
        href: "/guides/formation-guide",
        label: tactic === "Backline" ? "Formation & Backline" : "Formation",
      };
}

export default function TraitsPage() {
  return (
    <main>
      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/game/screenshot-3.webp"
          alt="Goodly Trials combat effects and unit traits in action"
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
              { label: "Traits" },
            ]}
          />
          <p className={styles.eyebrow}>
            Trait archive · effects, caps, and card context
          </p>
          <h1>Traits &amp; Effects</h1>
          <p>
            Compare every trait shown on the unit cards in one place. You can
            see its listed effect, cap, unit, faction, and tactic without
            opening a separate page that would add no useful detail.
          </p>
          <HeroIntel
            eyebrow="Effect ledger"
            title="Read every modifier"
            items={[
              { label: "Traits", value: traits.length },
              { label: "Compare", value: "Effects" },
              { label: "Check", value: "Caps" },
              { label: "Open", value: "Unit card" },
            ]}
          />
        </div>
      </section>
      <section className="container section">
        <div className={styles.portalGrid}>
          {traits.map((trait) => {
            const unit = getUnit(trait.unitSlug);
            const tactic = tacticGuide(unit?.tactic.name ?? "Formation");
            return (
              <article
                className={styles.portalCard}
                id={trait.slug}
                key={trait.slug}
              >
                <span>✦</span>
                <small>
                  Unit ·{" "}
                  <Link
                    className="entityLink"
                    href={`/wiki/units/${trait.unitSlug}`}
                  >
                    {trait.unitName}
                  </Link>
                </small>
                <h2>{trait.name}</h2>
                <p>{trait.effect}</p>
                {trait.cap && (
                  <p>
                    <strong>Listed cap:</strong> {trait.cap}
                  </p>
                )}
                {unit && (
                  <>
                    <p>
                      <strong>Card context:</strong> HP {unit.stats.hp} · ATK{" "}
                      {unit.stats.atk} · AR {unit.stats.ar} · RNG{" "}
                      {unit.stats.rng}
                      <br />
                      Gear {unit.gear ?? "not listed"} · Trinkets{" "}
                      {unit.trinkets ?? "not listed"}
                    </p>
                    <p>
                      <Link
                        className="entityLink"
                        href={`/wiki/factions/${unit.factionSlug}`}
                      >
                        {unit.faction}
                      </Link>{" "}
                      ·{" "}
                      <Link className="entityLink" href={tactic.href}>
                        {tactic.label}
                      </Link>
                    </p>
                  </>
                )}
                <Link href={`/wiki/units/${trait.unitSlug}`}>
                  <b>View unit card →</b>
                </Link>
              </article>
            );
          })}
        </div>
        <section className={styles.sectionBlock}>
          <h2>Traits are not roles</h2>
          <p>
            A trait can alter growth, income, spell damage, equipment value, or
            death interactions. It should be read beside a unit&apos;s skills,
            tactic, stats, and equipment slots—not converted into an unsupported
            fixed role.
          </p>
        </section>
      </section>
    </main>
  );
}
