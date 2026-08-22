"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "@/style/page/archive/archive.module.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <p className={styles.eyebrow}>Archive interruption</p>
          <h1>Something blocked this record</h1>
          <p>Try loading the page again, or return to the archive and continue from another record.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
            <button className="button button-primary" type="button" onClick={reset}>Try again</button>
            <Link className="button button-ghost" href="/wiki">Explore the Wiki</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
