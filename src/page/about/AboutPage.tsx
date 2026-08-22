import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata(
  "About Goodly Trials Wiki – How This Player Guide Works",
  "Learn what the Goodly Trials Wiki covers, how game details are checked, and how builds and player tips are presented.",
  "/about",
);

export default function AboutPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <p className={styles.eyebrow}>About this player guide</p>
          <h1>About Goodly Trials Wiki</h1>
          <p>This is a fan-made site for checking game cards, planning formations, and keeping up with changes that can affect a run.</p>
        </div>
      </section>
      <section className={`container section ${styles.prose}`}>
        <div className={styles.quickAnswer}>
          <b>An independent player guide</b>
          <p>Goodly Trials Wiki is not affiliated with, endorsed by, or operated by Osborn Design Works. Official game pages remain the place to confirm the live game.</p>
        </div>

        <h2>What you can use this site for</h2>
        <p>Use the Wiki to inspect unit, gear, leader, trait, and faction information that is currently available. Use Guides to understand a game decision, Builds to begin with an editable idea, and the Builder to lay out a company before you play.</p>

        <h2>How game details are handled</h2>
        <p>Numbers, card text, names, and patch changes are shown with the game version or check date available to the site. When a public card is incomplete, the page says so instead of filling the gap with guessed stats, abilities, or unlocks.</p>
        <p>Builds and formation notes are player suggestions. They are useful for comparing a plan with the cards on the board, but they are not official recommendations and cannot predict a match result.</p>

        <h2>Keeping pages current</h2>
        <p>The latest published patch listed here is {siteConfig.latestPatchVersion}, checked on {siteConfig.lastVerified}. Unit cards, gear cards, and board rules keep their own documented version, because a later patch number does not prove every individual record changed. Check the version shown beside the detail you are using before relying on an older note.</p>

        <h2>Official game links</h2>
        <p><a href={siteConfig.officialUrl} target="_blank" rel="noreferrer">Goodly Trials website ↗</a><br /><a href={siteConfig.playUrl} target="_blank" rel="noreferrer">Goodly Trials play portal ↗</a><br /><a href={siteConfig.steamUrl} target="_blank" rel="noreferrer">Goodly Trials on Steam ↗</a><br /><a href={siteConfig.patchNotesUrl} target="_blank" rel="noreferrer">Official patch notes ↗</a></p>

        <h2>Start with the page you need</h2>
        <p><Link href="/wiki">Browse the Wiki</Link> · <Link href="/guides">Read player guides</Link> · <Link href="/builder">Open the Builder</Link> · <Link href="/updates">See patch changes</Link></p>
      </section>
    </main>
  );
}
