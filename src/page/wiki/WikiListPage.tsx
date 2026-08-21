import Image from "next/image";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import WikiRecordList, { type WikiRecord } from "@/page/wiki/components/WikiRecordList";
import { factions, items, leaders, units } from "@/lib/data/game-content";
import mechanics from "@/data/game/mechanics.json";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import styles from "@/style/page/archive/archive.module.css";

export const metadata = createMetadata("Goodly Trials Wiki List – All Verified Records", "Search the complete Goodly Trials Wiki index of verified units, items, leaders, mechanics, factions, traits, and Ascendancy examples.", "/wiki/list");

const ascendancy = [
  ["Crushing", "Power", "Stuns a target for 1 second on the third hit."],
  ["Elusive", "Fortitude", "Gains 6 HP when an attack is evaded."],
  ["Revelatory", "Authority", "Spend twice a spell's MP to fully restore its cooldown after casting."],
  ["Momentous", "Power", "Gains +1 ATK on later attacks against the same target for the battle."],
] as const;

const records: WikiRecord[] = [
  ...units.map((unit) => ({ id: `unit-${unit.slug}`, kind: "Unit" as const, title: unit.name, meta: `${unit.faction} · ${unit.trait.name} · ${unit.tactic.name}`, description: unit.summary, href: `/wiki/units/${unit.slug}`, verified: unit.lastVerified })),
  ...items.map((item) => ({ id: `item-${item.slug}`, kind: "Item" as const, title: item.name, meta: `${item.type} · ${item.cost}G${item.requirements ? ` · ${item.requirements}` : ""}`, description: item.effects.join(" · "), href: `/wiki/items/${item.slug}`, verified: item.lastVerified })),
  ...leaders.map((leader) => ({ id: `leader-${leader.slug}`, kind: "Leader" as const, title: leader.name, meta: `${leader.faction} · ${leader.trait.name} · ${leader.gameVersion}`, description: leader.trait.effect, href: `/wiki/leaders/${leader.slug}`, verified: leader.lastVerified })),
  ...mechanics.map((entry) => ({ id: `mechanic-${entry.slug}`, kind: "Mechanic" as const, title: entry.title.replace("Goodly Trials ", ""), meta: entry.eyebrow, description: entry.summary, href: `/wiki/mechanics/${entry.slug}`, verified: siteConfig.lastVerified })),
  ...factions.map((faction) => ({ id: `faction-${faction.slug}`, kind: "Faction" as const, title: faction.name, meta: `${faction.roster.length} public roster names`, description: faction.summary, href: `/wiki/factions/${faction.slug}`, verified: siteConfig.lastVerified })),
  ...units.map((unit) => ({ id: `trait-${unit.slug}`, kind: "Trait" as const, title: unit.trait.name, meta: `On ${unit.name} · ${unit.faction}`, description: unit.trait.effect, href: `/wiki/units/${unit.slug}#abilities`, verified: unit.lastVerified })),
  ...ascendancy.map(([title, meta, description]) => ({ id: `ascendancy-${title}`, kind: "Ascendancy" as const, title, meta, description, href: "/wiki/ascendancy", verified: siteConfig.lastVerified })),
];

export default function WikiListPage() {
  return <main><section className={styles.hero}><Image className={styles.heroImage} src="/images/game/screenshot-2.webp" alt="Goodly Trials unit cards and reference data" fill preload sizes="100vw" /><div className={styles.heroShade} /><div className={`container ${styles.heroContent}`}><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Wiki List" }]} /><p className={styles.eyebrow}>All verified records · {siteConfig.currentVersion}</p><h1>Goodly Trials Wiki List</h1><p>One list for every currently verifiable wiki record. Filter by type or search by name, effect, statistic, faction, and mechanic, then open the relevant detail page.</p></div></section><section className="container section"><WikiRecordList records={records} /></section></main>;
}
