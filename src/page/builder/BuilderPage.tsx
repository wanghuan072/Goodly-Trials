import Breadcrumb from "@/components/navigation/Breadcrumb";
import { factions, items, leaders, units } from "@/lib/data/game-content";
import { createMetadata } from "@/seo/metadata";
import BuilderClient, { type BuilderLeader, type BuilderRosterUnit } from "./BuilderClient";
import styles from "@/style/page/builder/builder.module.css";

export const metadata = createMetadata(
  "Goodly Trials Company Builder",
  "Create a player-authored Goodly Trials company, equip public item examples, add notes, and share the plan with a link.",
  "/builder",
);

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const verifiedUnits = new Map(units.map((unit) => [unit.name, unit]));

const roster: BuilderRosterUnit[] = factions.flatMap((faction) =>
  faction.roster.map((name) => {
    const verified = verifiedUnits.get(name);
    return {
      slug: verified?.slug ?? slugify(name),
      name,
      faction: faction.name,
      factionSlug: faction.slug,
      accent: faction.accent,
      image: verified?.image ?? `/images/units/${slugify(name)}.png`,
      verified: Boolean(verified),
      gear: verified?.gear,
      trinkets: verified?.trinkets,
      stats: verified?.stats,
      trait: verified?.trait.name,
      traitEffect: verified?.trait.effect,
      tactic: verified?.tactic.name,
      tacticEffect: verified?.tactic.effect,
      skills: verified?.skills,
      quote: verified?.quote,
      recovery: verified?.recovery,
      manaRegen: verified?.manaRegen,
    };
  }),
);

const builderLeaders: BuilderLeader[] = leaders.map((leader) => ({
  slug: leader.slug,
  name: leader.name,
  epithet: leader.epithet,
  faction: leader.faction,
  factionSlug: leader.factionSlug,
  trait: leader.trait,
  stats: leader.stats,
}));

export default function BuilderPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Company Builder" }]} />
          <p className={styles.eyebrow}>Player workshop · v0.301 source layer</p>
          <h1>Company Builder</h1>
          <p>Drag a leader, units, and public item examples into a game-inspired board, inspect verified cards, and share your own plan. This tool records player ideas—it does not publish a “best” build.</p>
        </div>
      </section>
      <BuilderClient roster={roster} leaders={builderLeaders} items={items} />
    </main>
  );
}
