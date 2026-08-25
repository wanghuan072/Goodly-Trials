import Link from "next/link";
import styles from "@/style/page/archive/archive.module.css";

export default function NotFound() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <p className={styles.eyebrow}>404 · Lost on the road</p>
          <h1>Archive Entry Not Found</h1>
          <p>This record does not exist, may have moved, or has not yet passed the verification gate.</p>
          <div className={styles.errorActions}>
            <Link className="button button-primary" href="/wiki">Explore the Wiki</Link>
            <Link className="button button-ghost" href="/search">Search the archive</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
