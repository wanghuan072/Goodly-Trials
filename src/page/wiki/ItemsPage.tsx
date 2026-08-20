import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import ItemExplorer from "@/page/wiki/components/ItemExplorer";
import { siteConfig } from "@/config/site";
import { items } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata("Goodly Trials Items", "Search verified Goodly Trials weapons, shields, trinkets, spells, and potions with requirements, effects, and costs.", "/wiki/items");

export default function ItemsPage() {
  return <main><section className={styles.hero}><Image className={styles.heroImage} src="/images/game/screenshot-6.webp" alt="Goodly Trials advanced training screen explaining frontline targeting" fill preload sizes="100vw" /><div className={styles.heroShade} /><div className={`container ${styles.heroContent}`}><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Items" }]} /><p className={styles.eyebrow}>Verified equipment · {siteConfig.currentVersion}</p><h1>Goodly Trials Items</h1><p>Search official item examples by type, price, requirement, or effect. Recommendation pages are editorial and stay separate from the source data shown here.</p></div></section><section className="container section"><div className={styles.contentGrid}><div className={styles.mainColumn}><ItemExplorer items={items} /><div className={styles.sectionBlock}><h2>How equipment changes a company</h2><p>One-handed gear leaves another hand available. Two-handed equipment consumes both hands. Shields support frontline survival, trinkets occupy separate slots, spell tomes spend MP, and potions change a companion once without occupying a slot.</p><h3>Rolled attributes</h3><p>The official item guide notes that some shop equipment can carry additional STR, AGI, INT, or ALL traits. Those rolls change the item&apos;s name, price, and ideal bearer, so a static item record should be read as a base reference rather than every possible shop outcome.</p></div></div><aside className={styles.sidebar}><h2>Item types</h2>{["One-handed", "Two-handed", "Shields", "Trinkets", "Spells", "Potions"].map((type) => <a href="#items" key={type}>{type}</a>)}<h3>Related guides</h3><Link href="/guides/economy-guide">Shop & economy</Link><Link href="/builds">Build notes</Link><Link href="/updates">Item changes</Link></aside></div></section></main>;
}
