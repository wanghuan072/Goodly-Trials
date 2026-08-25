import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import HeroIntel from "@/components/content/HeroIntel";
import { siteConfig } from "@/config/site";
import { builds, items, units } from "@/lib/data/game-content";
import BuildCard from "@/page/builds/components/BuildCard";
import JsonLd from "@/seo/JsonLd";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/builds/builds.module.css";

export const metadata = createMetadata(
  "Goodly Trials Builds – Editable Teams & Formation Ideas",
  "Browse editable Goodly Trials team builds with formation previews, unit cards, gear plans, strengths, trade-offs, and one-click Builder loading.",
  "/builds",
);

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
          src="/images/game/hero-builds-v3.webp"
          alt="Adventurers planning a formation around a torchlit campaign table"
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
            <p className={styles.eyebrow}>Editable starting ideas · formation library</p>
            <h1>Goodly Trials Builds - Team Comps &amp; Formations</h1>
            <p>
              Start with a complete formation instead of a loose unit idea. Each
              build shows a board, roster, gear goals, strengths, and trade-offs,
              then opens in the Builder so you can change it for your own run.
            </p>
          </div>
          <HeroIntel className="hero-intel-inline" eyebrow="Build anatomy" title="Start complete, then revise" items={[{ value: "L", label: "Leader" }, { value: "6×6", label: "Formation" }, { value: "G", label: "Gear plan" }, { value: "↻", label: "Editable" }]} />
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
        {builds.map((build, index) => (
          <BuildCard build={build} index={index} key={build.slug} />
        ))}
      </section>

      <aside className={`container ${styles.disclosure}`}>
        <strong>How to use these builds</strong>
        <p>
          Each preset can be opened in the Builder and changed freely. Strengths and
          weaknesses explain the idea behind each setup; no build promises a win,
          a shop roll, or a combat result.
        </p>
        <Link href="/builder">Build your own company →</Link>
      </aside>
    </main>
  );
}
