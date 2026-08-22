import Image from "next/image";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import EntityLinks from "@/components/content/EntityLinks";
import HeroIntel from "@/components/content/HeroIntel";
import { updates } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";
export const metadata = createMetadata(
  "Goodly Trials Updates & Patch Notes",
  "Goodly Trials patch notes and selected changes that affect units, gear, leaders, traits, and builds.",
  "/updates",
);
export default function UpdatesPage() {
  return (
    <main>
      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/game/hero-updates-v3.webp"
          alt="A company rebuilding a bridge and raising its banner after battle"
          fill
          preload
          sizes="100vw"
        />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Updates" }]}
          />
          <p className={styles.eyebrow}>
            Patch notes · changes worth checking before a run
          </p>
          <h1>Goodly Trials Updates - Patch Notes &amp; Changes</h1>
          <p>
            See the selected patch changes that affect the cards and builds on
            this site. Each note links to the official patch page and to the
            related units, gear, leaders, or builds when those pages exist.
          </p>
          <HeroIntel
            eyebrow="Change log"
            title="Track what matters"
            items={[
              { label: "Patch notes", value: updates.length },
              { label: "Review", value: "Units" },
              { label: "Review", value: "Gear" },
              { label: "Adapt", value: "Builds" },
            ]}
          />
        </div>
      </section>
      <section className="container section">
        <div className={styles.quickAnswer}>
          <b>What you&apos;ll find here</b>
          <p>
            The official patch page is the complete changelog. This page keeps
            the updates that make a practical difference to the units, gear,
            leaders, and build ideas shown here.
          </p>
        </div>
        <div className={styles.entryList}>
          {updates.map((update) => (
            <article
              className={styles.entryRow}
              id={update.slug}
              key={update.slug}
            >
              <span>
                {update.date} · {update.type}
              </span>
              <div>
                <h2>
                  {update.version} · {update.title}
                </h2>
                <p>
                  <EntityLinks>{update.summary}</EntityLinks>
                </p>
                <p>
                  <strong>Why it matters here:</strong>{" "}
                  <EntityLinks>{update.impact}</EntityLinks>
                </p>
              </div>
              <a
                className="entityLink"
                href={update.source}
                target="_blank"
                rel="noreferrer"
              >
                Official note ↗
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
