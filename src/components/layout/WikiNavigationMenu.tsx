"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import Link from "next/link";
import styles from "@/style/layout/app-header.module.css";

type WikiLink = { href: string; label: string };

export default function WikiNavigationMenu({ links, active }: { links: readonly WikiLink[]; active?: boolean }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => { document.removeEventListener("pointerdown", closeOutside); document.removeEventListener("keydown", closeEscape); };
  }, []);

  const closeOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  };

  return <div className={styles.wikiMenu} ref={menuRef} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onBlur={closeOnBlur}>
    <Link className={`${styles.wikiMenuTrigger} ${active ? styles.activeLink : ""}`} href="/wiki" aria-current={active ? "page" : undefined} aria-haspopup="menu" aria-expanded={open} onFocus={() => setOpen(true)}>Wiki<span className={styles.wikiMenuArrow} aria-hidden="true">▾</span></Link>
    {open && <div role="menu" aria-label="Wiki navigation">{links.map((link) => <Link role="menuitem" key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</div>}
  </div>;
}
