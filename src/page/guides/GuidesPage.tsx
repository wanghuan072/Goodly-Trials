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
  return (
    <main>
      <section className={styles.hero}>
        <Image className={styles.heroImage} src="/images/game/hero-guides-v3.webp" alt="A veteran pathfinder guiding an adventurer at a moonlit crossroads" fill preload sizes="100vw" />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
          <p className={styles.eyebrow}>Player guides · shop, board, and game modes</p>
          <h1>Player Guides</h1>
          <p>Start with the question in front of you: what to buy, where to place a unit, how a mode works, or why a build needs changing. These guides point you back to the relevant cards when the answer depends on the details.</p>
        </div>
      </section>
      <section className="container section">
        <header className={styles.guideHeading}>
          <p>Choose a topic</p>
          <h2>Start where your next decision is</h2>
        </header>
        <div className={styles.guideGrid}>
          {guides.map((guide) => (
            <article className={styles.guideEntry} key={guide.slug}>
              <p className={styles.guideCategory}>{guide.category}</p>
              <Link href={`/guides/${guide.slug}`}>
                <div className={styles.guideImage}>
                  <Image
                    src={guide.image}
                    alt={guide.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.guideBody}>
                  <h3>{guide.title}</h3>
                  <p>{guide.excerpt}</p>
                  <span>Read guide →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
