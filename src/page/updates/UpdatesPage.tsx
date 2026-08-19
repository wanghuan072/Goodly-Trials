import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { updates } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";
export const metadata = createMetadata("Goodly Trials Updates & Patch Notes", "Versioned Goodly Trials update summaries with independent build and data impact notes.", "/updates");
export default function UpdatesPage() { return <main><section className={styles.hero}><Image className={styles.heroImage} src="/images/game/screenshot-4.webp" alt="Goodly Trials battlefield after combat" fill preload sizes="100vw" /><div className={styles.heroShade} /><div className={`container ${styles.heroContent}`}><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Updates" }]} /><p className={styles.eyebrow}>Patch context · Official source summaries</p><h1>Goodly Trials Updates</h1><p>A version timeline that paraphrases official notes, then adds a separate “what this changes” layer for the wiki and build archive.</p></div></section><section className="container section"><div className={styles.entryList}>{updates.map((update) => <Link className={styles.entryRow} href={`/updates/${update.slug}`} key={update.slug}><span>{update.date} · {update.type}</span><div><h2>{update.version} · {update.title}</h2><p>{update.summary}</p></div><b>Impact →</b></Link>)}</div></section></main>; }
