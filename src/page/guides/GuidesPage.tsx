import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { guides } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata(
  "Goodly Trials Guides – Shop, Formation & Game Modes",
  "Goodly Trials guides for first runs, formation, flanking, multiplayer, Ranked, and progression.",
  "/guides",
);

export default function GuidesPage() {
  const groups = Map.groupBy(guides, (guide) => guide.category);

  return (
    <main>
      <section className={styles.hero}>
        <Image className={styles.heroImage} src="/images/game/screenshot-7.webp" alt="Goodly Trials leader training interface" fill preload sizes="100vw" />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
          <p className={styles.eyebrow}>Player guides · shop, board, and game modes</p>
          <h1>Player Guides</h1>
          <p>Start with the question in front of you: what to buy, where to place a unit, how a mode works, or why a build needs changing. These guides point you back to the relevant cards when the answer depends on the details.</p>
        </div>
      </section>
      <section className="container section">
        {Array.from(groups.entries()).map(([category, entries]) => (
          <section key={category} style={{ marginBottom: 54 }}>
            <div className="section-heading"><p>Guides for your next run</p><h2>{category}</h2></div>
            <div className={styles.entryList}>
              {entries.map((guide) => (
                <Link className={styles.entryRow} href={`/guides/${guide.slug}`} key={guide.slug}>
                  <span>{category}</span>
                  <div><h3>{guide.title}</h3><p>{guide.excerpt}</p></div>
                  <b>Read guide →</b>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
