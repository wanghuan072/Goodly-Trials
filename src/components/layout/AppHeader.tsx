"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { primaryNavigation, wikiNavigation } from "@/config/site";
import WikiNavigationMenu from "@/components/layout/WikiNavigationMenu";
import styles from "@/style/layout/app-header.module.css";

function SearchForm({ id }: { id: string }) {
  return (
    <form className={styles.search} action="/search" role="search">
      <label className="sr-only" htmlFor={id}>Search the Goodly Trials Wiki</label>
      <input id={id} name="q" type="search" placeholder="Search units, gear, guides…" />
      <button type="submit" aria-label="Search">⌕</button>
    </form>
  );
}

export default function AppHeader() {
  const pathname = usePathname();
  const desktopSearchId = useId();
  const mobileSearchId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.brand} href="/" aria-label="Goodly Trials Wiki home">
          <Image src="/images/ui/goodly-trials-crest.png" alt="" width={52} height={52} aria-hidden="true" />
          <span><b>Goodly<br />Trials</b><small>Wiki</small></span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {primaryNavigation.map((item) => item.label === "Wiki" ? <WikiNavigationMenu key={item.href} links={wikiNavigation} active={isActive(item.href)} /> : <Link className={isActive(item.href) ? styles.activeLink : undefined} aria-current={isActive(item.href) ? "page" : undefined} key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className={styles.desktopSearch}><SearchForm id={desktopSearchId} /></div>
        <div className={styles.mobileMenu}>
          <button className={styles.mobileMenuButton} type="button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen((open) => !open)}><span /><span /><span /></button>
          {mobileOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" onClick={() => setMobileOpen(false)}>
            {primaryNavigation.map((item) => <Link className={isActive(item.href) ? styles.activeMobileLink : undefined} aria-current={isActive(item.href) ? "page" : undefined} key={item.href} href={item.href}>{item.label}</Link>)}
            <div className={styles.mobileWiki}>{wikiNavigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
            <SearchForm id={mobileSearchId} />
          </nav>}
        </div>
      </div>
    </header>
  );
}
