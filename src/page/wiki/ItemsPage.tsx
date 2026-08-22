import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import HeroIntel from "@/components/content/HeroIntel";
import ItemExplorer from "@/page/wiki/components/ItemExplorer";
import { items } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata(
  "Goodly Trials Gear – Weapons, Trinkets & Requirements",
  "Check Goodly Trials gear requirements, costs, slots, and effects for weapons, shields, trinkets, spells, and potions.",
  "/wiki/gear",
);

export default function ItemsPage() {
  return (
    <main>
      <section className={styles.hero}>
        <Image className={styles.heroImage} src="/images/game/screenshot-6.webp" alt="Goodly Trials equipment and item interface" fill preload sizes="100vw" />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Gear" }]} />
          <p className={styles.eyebrow}>Gear archive · costs, requirements, and effects</p>
          <h1>Gear Archive</h1>
          <p>Check what an item costs, which attributes it needs, and where it fits before you spend a shop turn on it. Use the type filters to compare weapons, shields, trinkets, spells, and potions.</p>
          <HeroIntel
            eyebrow="Quartermaster"
            title="Prepare the loadout"
            items={[
              { label: "Gear records", value: items.length },
              { label: "Weapons", value: "Hands" },
              { label: "Magic", value: "Spells" },
              { label: "Utility", value: "Trinkets" },
            ]}
          />
        </div>
      </section>
      <section className="container section">
        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <ItemExplorer items={items} />
            <div className={styles.sectionBlock}>
              <h2>How gear changes a company</h2>
              <p>One-handed gear leaves another hand available. Two-handed equipment uses both hands. Shields help a frontline unit stay in the fight, trinkets use their own slots, spell tomes spend MP, and potions change a companion once without taking a slot.</p>
              <h3>Rolled attributes</h3>
              <p>Some shop equipment can roll extra STR, AGI, INT, or ALL traits. Those rolls can change the item&apos;s name, cost, and best bearer, so use a listed item as a starting point rather than assuming every shop copy will be identical.</p>
            </div>
          </div>
          <aside className={styles.sidebar}>
            <h2>Gear types</h2>
            <div className={styles.sidebarTokens}>{["One-handed", "Two-handed", "Shields", "Trinkets", "Spells", "Potions"].map((type) => <span key={type}>{type}</span>)}</div>
            <h3>Keep reading</h3>
            <Link href="/guides/beginners-guide">First shop and equipment</Link>
            <Link href="/builds">Starting builds</Link>
            <Link href="/updates">Gear changes</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
