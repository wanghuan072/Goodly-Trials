import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import UnitSprite from "@/components/content/UnitSprite";
import { siteConfig } from "@/config/site";
import { factions } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import archive from "@/style/page/archive/archive.module.css";
import detail from "@/style/page/wiki/detail.module.css";

export const metadata = createMetadata(
  "Goodly Trials Factions – Roster Names & Playstyles",
  "Explore Goodly Folk, Bone Host, and Belowborn roster names, faction identities, and the unit cards available to inspect.",
  "/wiki/factions",
);

export default function FactionsPage() {
  return (
    <main>
      <section className={archive.hero}>
        <Image className={archive.heroImage} src="/images/game/hero-battlefield-v2.webp" alt="Pixel-art company facing enemy formations across a moonlit tactical battlefield" fill preload sizes="100vw" />
        <div className={archive.heroShade} />
        <div className={`container ${archive.heroContent}`}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wiki", href: "/wiki" }, { label: "Factions" }]} />
          <p className={archive.eyebrow}>Factions and roster context · latest patch {siteConfig.latestPatchVersion}</p>
          <h1>Factions &amp; Rosters</h1>
          <p>See how Goodly Folk, Bone Host, and Belowborn differ, which roster names are currently visible, and which units have full cards you can inspect before building a company.</p>
        </div>
      </section>
      <section className="container section">
        <div className={archive.portalGrid}>
          {factions.map((faction) => <Link className={archive.portalCard} href={`/wiki/factions/${faction.slug}`} key={faction.slug}><UnitSprite src={faction.image} color={faction.accent} /><h2>{faction.name}</h2><p>{faction.summary}</p><b>View faction →</b></Link>)}
        </div>
        <section className={archive.sectionBlock}>
          <h2>How factions shape a company</h2>
          <p>Faction identity is more useful than a simple damage label. Goodly Folk support nearby allies, Bone Host units return or feed on deaths, and Belowborn combine dwarven economy with heavier deep recruits. Open a faction page to see the roster context, then open a unit card when you need stats or tactics.</p>
          <div className={detail.relatedGrid}>{factions.map((faction) => <Link href={`/wiki/factions/${faction.slug}`} key={faction.slug}><b>{faction.name}</b><span>{faction.roster.length} roster names shown here</span></Link>)}</div>
        </section>
      </section>
    </main>
  );
}
