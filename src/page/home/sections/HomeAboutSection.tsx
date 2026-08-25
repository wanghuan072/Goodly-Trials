import Link from "next/link";
import styles from "@/style/page/home/home.module.css";

export default function HomeAboutSection() {
  return (
    <>
      <section className={styles.infoRow}>
        <article className={styles.frame}>
          <p className={styles.kicker}>Built for the moment before a match</p>
          <h2>Check the card. Shape the board. Try the idea.</h2>
          <p>
            This site brings together the parts of Goodly Trials that players
            tend to look up mid-run: unit stats, gear requirements, leader
            cards, faction context, formation ideas, and patch changes. It is
            a planning companion, not the official game or a promise that one
            setup will win every fight.
          </p>
          <Link className="button button-ghost" href="/about">
            How this site is maintained
          </Link>
        </article>
        <article className={styles.frame}>
          <p className={styles.kicker}>Questions players ask first</p>
          <h2>Before you build a company</h2>
          <div className={styles.faqGrid}>
            <div><h3>Is this an official site?</h3><p>No. It is an independent player guide that links back to the official game pages.</p></div>
            <div><h3>Can a build guarantee a win?</h3><p>No. Builds are editable starting points; the live board, shop, and opponents still decide the run.</p></div>
            <div><h3>What does the Builder check?</h3><p>It checks the selected week, active cells, follower limits, and known equipment capacity.</p></div>
            <div><h3>Where should I begin?</h3><p>Choose a leader, compare the unit roles you need, then test the spacing in the Builder.</p></div>
          </div>
        </article>
      </section>

      <section className={`${styles.frame} ${styles.sourcePanel}`}>
        <div>
          <p className={styles.kicker}>Keep the facts and the ideas separate</p>
          <h2>Use the game data to make your own call.</h2>
        </div>
        <p>
          Compare the cards, effects, and formation rules first. Then treat
          builds and positioning notes as editable starting points for your
          own company.
        </p>
        <Link className="button button-ghost" href="/about">
          Read how it works
        </Link>
      </section>
    </>
  );
}
