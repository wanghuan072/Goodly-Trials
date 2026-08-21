"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "@/style/layout/app-header.module.css";

type WikiLink = { href: string; label: string };

export default function WikiNavigationMenu({ links }: { links: readonly WikiLink[] }) {
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

  return <div className={styles.wikiMenu} ref={menuRef} onMouseLeave={() => setOpen(false)}>
    <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>Wiki</button>
    {open && <div role="menu" aria-label="Wiki navigation">{links.map((link) => <Link role="menuitem" key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</div>}
  </div>;
}
