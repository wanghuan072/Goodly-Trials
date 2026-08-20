import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import UnitSprite from "@/components/content/UnitSprite";
import { siteConfig } from "@/config/site";
import { factions } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import archive from "@/style/page/archive/archive.module.css";
import detail from "@/style/page/wiki/detail.module.css";

export const metadata = createMetadata("Goodly Trials Factions", "Compare the verified public identities and rosters of Goodly Folk, Bone Host, and Belowborn.", "/wiki/factions");

export default function FactionsPage() {
  return <main><section className={archive.hero}><Image className={archive.heroImage} src="/images/game/screenshot-9.webp" alt="Goodly Trials Deed Shop showing faction reward tracks" fill preload sizes="100vw" /><div className={archive.heroShade} /><div className={`container ${archive.heroContent}`}><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Factions" }]} /><p className={archive.eyebrow}>Company identities · {siteConfig.currentVersion}</p><h1>Goodly Trials Factions</h1><p>Three public factions shape the current archive. Their descriptions and visible roster names come from official mechanics assets; strategy framing is labeled editorial.</p></div></section><section className="container section"><div className={archive.portalGrid}>{factions.map((faction) => <Link className={archive.portalCard} href={`/wiki/factions/${faction.slug}`} key={faction.slug}><UnitSprite src={faction.image} color={faction.accent} /><h2>{faction.name}</h2><p>{faction.summary}</p><b>Open faction archive →</b></Link>)}</div><section className={archive.sectionBlock}><h2>How factions affect roster planning</h2><p>The official units page describes faction identity through roster mechanics rather than a simple damage-type label. Goodly Folk lend support to neighbors, Bone Host units return or feed on deaths, and Belowborn combine dwarven economy with heavier deep recruits.</p><div className={detail.relatedGrid}>{factions.map((faction) => <Link href={`/wiki/factions/${faction.slug}`} key={faction.slug}><b>{faction.name}</b><span>{faction.roster.length} public art names in the current archive</span></Link>)}</div></section></section></main>;
}
