import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { guides } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata("Goodly Trials Guides", "Problem-focused Goodly Trials guides for beginners, formation, stats, economy, Ascendancy, multiplayer, and Ranked.", "/guides");

export default function GuidesPage() {
  const groups = Map.groupBy(guides, (guide) => guide.category);
  return <main><section className={styles.hero}><Image className={styles.heroImage} src="/images/game/screenshot-7.webp" alt="Goodly Trials leader training interface" fill preload sizes="100vw" /><div className={styles.heroShade} /><div className={`container ${styles.heroContent}`}><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Guides" }]} /><p className={styles.eyebrow}>Field manuals · v0.301</p><h1>Goodly Trials Guides</h1><p>Use these manuals to answer a concrete question, then follow the linked unit, item, faction, and mechanic records behind the advice.</p></div></section><section className="container section">{Array.from(groups.entries()).map(([category, entries]) => <section key={category} style={{ marginBottom: 54 }}><div className="section-heading"><p>Guide collection</p><h2>{category}</h2></div><div className={styles.entryList}>{entries.map((guide) => <Link className={styles.entryRow} href={`/guides/${guide.slug}`} key={guide.slug}><span>{category}</span><div><h3>{guide.title}</h3><p>{guide.excerpt}</p></div><b>Read guide →</b></Link>)}</div></section>)}</section></main>;
}
