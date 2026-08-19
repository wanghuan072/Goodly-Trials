import Breadcrumb from "@/components/navigation/Breadcrumb";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata("Goodly Trials Ascendancy", "Understand verified Power, Fortitude, and Authority Ascendancy examples in Goodly Trials.", "/wiki/ascendancy");
const entries = [
  ["Crushing", "Power", "STR → ATK · AGI → ATK · INT → ATK", "Stuns a target for 1 second on the third hit."],
  ["Elusive", "Fortitude", "STR → AR + HPR · AGI → EVA · INT → ES", "Gains 6 HP when an attack is evaded."],
  ["Revelatory", "Authority", "STR → HP+ · AGI → SPD · INT → MP + MPR", "Spend twice a spell's MP to fully restore its cooldown after casting."],
  ["Momentous", "Power", "STR → ATK · AGI → ATK · INT → ATK", "Gains +1 ATK on attacks after the first against the same target for the battle."],
];
export default function AscendancyPage() { return <main><section className={styles.hero}><div className={`container ${styles.heroContent}`}><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Ascendancy" }]} /><p className={styles.eyebrow}>Attribute progression · v0.300</p><h1>Goodly Trials Ascendancy</h1><p>Attributes are promises about what care can make a companion become. A primary attribute raised far enough can lead toward Power, Fortitude, or Authority.</p></div></section><section className="container section"><div className={styles.portalGrid}>{entries.map(([name, type, conversion, effect]) => <article className={styles.portalCard} key={name}><span>✥</span><h2>{name}</h2><p><strong>{type}</strong><br />{conversion}</p><p>{effect}</p></article>)}</div><section className={styles.sectionBlock}><h2>Choose from the whole card</h2><p>An Ascendancy recommendation must account for primary attribute, existing stats, gear, tactic, formation, and mode. The examples above are verified mechanics, not a universal ranking.</p></section></section></main>; }
