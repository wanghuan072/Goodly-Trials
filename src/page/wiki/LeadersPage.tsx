import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import HeroIntel from "@/components/content/HeroIntel";
import { leaders } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";
export const metadata = createMetadata(
  "Goodly Trials Leaders – Starting Stats, Slots & Traits",
  "Check Goodly Trials leader cards, including starting stats, gear slots, trinket slots, and traits.",
  "/wiki/leaders",
);
export default function LeadersPage() {
  return (
    <main>
      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/game/hero-leaders-v3.webp"
          alt="A company leader overlooking a moonlit valley from a fortress battlement"
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
              { label: "Leaders" },
            ]}
          />
          <p className={styles.eyebrow}>Leader archive · current official client records</p>
          <h1>Goodly Trials Leaders - Stats, Traits &amp; Builds</h1>
          <p>
            Compare current leader records, then open one for starting stats,
            gear and trinket slots. Leaders with fully transcribed public card
            text show their complete trait wording; the remaining records are
            clearly labelled as client records.
          </p>
          <HeroIntel
            eyebrow="Command desk"
            title="Choose a leader"
            items={[
              { label: "Leader cards", value: leaders.length },
              { label: "Compare", value: "Stats" },
              { label: "Review", value: "Traits" },
              { label: "Plan", value: "Slots" },
            ]}
          />
        </div>
      </section>
      <section className="container section">
        <div className={styles.portalGrid}>
          {leaders.map((leader) => (
            <Link
              className={styles.portalCard}
              href={`/wiki/leaders/${leader.slug}`}
              key={leader.slug}
            >
              <span>♛</span>
              <h2>
                {leader.name}
                {leader.epithet && (
                  <>
                    <br />
                    <small>{leader.epithet}</small>
                  </>
                )}
              </h2>
              <p>
                <strong>{leader.faction}</strong> · {leader.gear} gear ·{" "}
                {leader.trinkets} trinket{leader.trinkets === 1 ? "" : "s"}
              </p>
              <p>
                ES {leader.stats.es} · HP {leader.stats.hp} · MP{" "}
                {leader.stats.mp}
                <br />
                STR {leader.stats.str} · AGI {leader.stats.agi} · INT{" "}
                {leader.stats.int}
              </p>
              <p>
                <strong>{leader.trait.name}</strong> — {leader.trait.effect}
              </p>
              <b>View leader →</b>
            </Link>
          ))}
        </div>
        <section className={styles.sectionBlock}>
          <h2>Leader record coverage</h2>
          <p>
            This archive includes the current public client&apos;s leader records.
            Seven leaders have fully transcribed public card text; the
            remaining entries retain their current official names, faction,
            slots, base stats, and trait names while their complete trait
            wording is not yet published here.
          </p>
          <p>
            See the selected{" "}
            <Link href="/updates#v0-301-leader-kits-outcast">
              v0.301 impact note
            </Link>{" "}
            and{" "}
            <Link href="/updates#v0-300-new-bone-host-leaders">
              v0.300 Bone Host note
            </Link>
            .
          </p>
        </section>
        <section className={styles.sectionBlock}>
          <h2>Official game page</h2>
          <p>
            <a
              href="https://goodlytrials.com/"
              target="_blank"
              rel="noreferrer"
            >
              Official Goodly Trials leader cards ↗
            </a>
          </p>
        </section>
      </section>
    </main>
  );
}
