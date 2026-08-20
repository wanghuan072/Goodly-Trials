import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { builds } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata("Goodly Trials Builds", "Versioned Goodly Trials build notes that separate verified stats and requirements from editorial recommendations.", "/builds");
export default function BuildsPage() { return <main><section className={styles.hero}><Image className={styles.heroImage} src="/images/game/screenshot-2.webp" alt="Goodly Trials scout report comparing two units before battle" fill preload sizes="100vw" /><div className={styles.heroShade} /><div className={`container ${styles.heroContent}`}><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Builds" }]} /><p className={styles.eyebrow}>Editorial field notes · v0.301</p><h1>Goodly Trials Builds</h1><p>Fast answers first, evidence second. Every build names its version and links the verified unit and item records used to make the case.</p></div></section><section className="container section"><div className={styles.quickAnswer}><b>Editorial policy</b><p>These are transparent starting points, not official developer recommendations or permanent “best builds.” Random traits, shop rolls, modes, and patches can change the result.</p></div><div className={styles.entryList}>{builds.map((build) => <Link className={styles.entryRow} href={`/builds/${build.slug}`} key={build.slug}><span>{build.faction} · {build.difficulty}</span><div><h2>{build.title}</h2><p>{build.summary}</p></div><b>{build.version} →</b></Link>)}</div></section></main>; }
