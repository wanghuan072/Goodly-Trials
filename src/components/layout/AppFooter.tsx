import Image from "next/image";
import Link from "next/link";
import { siteConfig, wikiNavigation } from "@/config/site";
import styles from "@/style/layout/app-footer.module.css";

export default function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.about}>
          <Image src="/images/ui/goodly-trials-crest.png" alt="" width={64} height={64} aria-hidden="true" />
          <h2>Goodly Trials Wiki</h2>
          <p>An independent, source-conscious field archive. Not affiliated with Osborn Design Works.</p>
        </div>
        <div><h2>Wiki</h2>{wikiNavigation.slice(0, 5).map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
        <div><h2>Field Notes</h2><Link href="/guides">Guides</Link><Link href="/builds">Builds</Link><Link href="/tier-list">Tier methodology</Link><Link href="/updates">Updates</Link></div>
        <div><h2>Sources</h2><a href={siteConfig.officialUrl} target="_blank" rel="noreferrer">Official game site</a><a href={siteConfig.steamUrl} target="_blank" rel="noreferrer">Goodly Trials on Steam</a><Link href="/about">About this archive</Link></div>
      </div>
      <div className={`container ${styles.bottom}`}><span>Verified against public sources · {siteConfig.lastVerified}</span><span>{siteConfig.currentVersion}</span></div>
    </footer>
  );
}
