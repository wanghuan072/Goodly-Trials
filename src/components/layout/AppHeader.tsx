import Image from "next/image";
import Link from "next/link";
import { primaryNavigation, wikiNavigation } from "@/config/site";
import styles from "@/style/layout/app-header.module.css";

function SearchForm() {
  return (
    <form className={styles.search} action="/search" role="search">
      <label className="sr-only" htmlFor="site-search">Search the Goodly Trials Wiki</label>
      <input id="site-search" name="q" type="search" placeholder="Search Goodly Trials Wiki…" />
      <button type="submit" aria-label="Search">⌕</button>
    </form>
  );
}

export default function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.brand} href="/" aria-label="Goodly Trials Wiki home">
          <Image src="/images/ui/goodly-trials-crest.png" alt="" width={52} height={52} aria-hidden="true" />
          <span><b>Goodly<br />Trials</b><small>Wiki</small></span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {primaryNavigation.map((item) => item.label === "Wiki" ? (
            <details className={styles.wikiMenu} key={item.href}>
              <summary>Wiki</summary>
              <div>{wikiNavigation.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div>
            </details>
          ) : <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className={styles.desktopSearch}><SearchForm /></div>
        <details className={styles.mobileMenu}>
          <summary aria-label="Open navigation"><span /><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            {primaryNavigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <div className={styles.mobileWiki}>{wikiNavigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
            <SearchForm />
          </nav>
        </details>
      </div>
    </header>
  );
}
