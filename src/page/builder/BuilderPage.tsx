import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { siteConfig } from "@/config/site";
import { factions, items, leaders, units } from "@/lib/data/game-content";
import JsonLd from "@/seo/JsonLd";
import { createMetadata } from "@/seo/metadata";
import BuilderClient, { type BuilderLeader, type BuilderRosterUnit } from "./BuilderClient";
import styles from "@/style/page/builder/builder.module.css";

export const metadata = createMetadata(
  "Goodly Trials Company Builder & Formation Planner",
  "Plan a Goodly Trials company with a game-inspired formation board. Choose a leader, place units, assign verified item examples, and save notes locally.",
  "/builder",
);

const builderSteps = [
  {
    title: "Set the rules for your run",
    text: "Choose the game mode and trial week first. The week controls which board cells are active, while the selected ruleset determines the follower limit used by the planner.",
  },
  {
    title: "Choose a company leader",
    text: "Open Leaders in the Archive and drag a leader to the leader slot, or click the leader once. In non-multiplayer modes, the Archive then narrows to followers from that leader’s faction.",
  },
  {
    title: "Place followers on active cells",
    text: "Drag units from the Archive onto open cells. For a long move, click a unit, scroll normally, and click the target cell. Locked records explain whether a leader, faction match, open cell, or roster space is required.",
  },
  {
    title: "Assign gear and trinkets",
    text: "Switch to Items and drag a verified public item example onto a compatible unit card. Equipment is limited by that unit’s known Gear and Trinket capacity, and equipped items can be moved or removed.",
  },
  {
    title: "Inspect, adjust, and record the plan",
    text: "Hover or focus an Archive record to review its available details, move units between cells, rotate an active formation row when useful, and add notes. The current plan saves automatically on this device.",
  },
] as const;

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
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            "@id": `${siteConfig.url}/builder#application`,
            name: "Goodly Trials Company Builder",
            url: `${siteConfig.url}/builder`,
            description: "A free browser-based Goodly Trials formation planner for choosing a leader, positioning units, assigning verified public item examples, and recording player notes.",
            applicationCategory: "GameApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires a modern web browser with JavaScript enabled",
            isAccessibleForFree: true,
            about: { "@id": `${siteConfig.url}/#game` },
            featureList: [
              "Game-inspired formation board",
              "Leader and faction-aware roster planning",
              "Trial week placement limits",
              "Gear and trinket capacity checks",
              "Device-local autosave",
            ],
          },
          {
            "@type": "HowTo",
            name: "How to plan a Goodly Trials company",
            description: "Choose the ruleset, assign a leader, place followers, equip items, and save formation notes in the Goodly Trials Company Builder.",
            step: builderSteps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title,
              text: step.text,
              url: `${siteConfig.url}/builder#step-${index + 1}`,
            })),
          },
        ],
      }} />
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Company Builder" }]} />
          <p className={styles.eyebrow}>Player workshop · placement rules verified for v0.302</p>
          <h1>Company Builder</h1>
          <p>Plan a Goodly Trials formation before your next run. Choose a leader, arrange faction units on a game-inspired board, assign verified public item examples, and keep your notes saved on this device.</p>
        </div>
      </section>
      <BuilderClient roster={roster} leaders={builderLeaders} items={items} />

      <article className={`container ${styles.builderGuide}`} aria-labelledby="builder-guide-title">
        <header className={styles.guideIntro}>
          <div>
            <p className={styles.guideEyebrow}>Goodly Trials formation planner</p>
            <h2 id="builder-guide-title">Why plan your company on this board?</h2>
          </div>
          <p>A formation is easier to evaluate when you can see the leader, followers, open cells, and equipment together. This builder turns a written build idea into a board you can inspect and revise before playing, without presenting any arrangement as a guaranteed or “best” result.</p>
        </header>

        <section className={styles.advantageGrid} aria-label="Company Builder advantages">
          <article>
            <span>01</span>
            <h3>Built around the game’s board language</h3>
            <p>The planning surface uses a formation grid, unit cards, a leader slot, and a separate Archive, so the task feels closer to preparing a company than filling out a generic form.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Useful limits are checked while you plan</h3>
            <p>The board enforces active cells, one unit per cell, leader and faction requirements, follower limits, and known equipment capacity. When an action is blocked, the Archive shows the reason.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Verified records stay separate from assumptions</h3>
            <p>Available public leader, unit, and item details are shown inside the planner. Incomplete records remain clearly labeled instead of being filled with invented statistics or effects.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Drag when convenient; click for long moves</h3>
            <p>Desktop players can drag records directly. If the destination is farther down the board, click a record to carry it, scroll normally, then click the target—no precision drag across the whole page is required.</p>
          </article>
          <article>
            <span>05</span>
            <h3>Your working plan remains editable</h3>
            <p>Units and equipment can be moved or removed, notes can be revised, and the plan saves locally in the current browser. You can return to the same device and continue adjusting it.</p>
          </article>
          <article>
            <span>06</span>
            <h3>Planning support, not a combat simulator</h3>
            <p>The builder helps organize a company and surface rule conflicts. It does not calculate battle outcomes, promise win rates, or replace testing the formation in the live game.</p>
          </article>
        </section>

        <figure className={styles.gameReference}>
          <Image
            src="/images/game/screenshot-1.webp"
            alt="Goodly Trials in-game board with unit cards arranged in formation, a shop list, and a unit inspection panel"
            width={1920}
            height={1080}
            sizes="(max-width: 768px) 100vw, 1180px"
          />
          <figcaption><strong>Why position matters:</strong> the official public game screenshot shows how formation, unit cards, equipment, and inspection data share one decision space. Our builder follows that planning workflow while remaining an independent pre-run tool.</figcaption>
        </figure>

        <section className={styles.howTo} aria-labelledby="builder-how-to">
          <header>
            <p className={styles.guideEyebrow}>Five-step workflow</p>
            <h2 id="builder-how-to">How to use the Goodly Trials Company Builder</h2>
            <p>Start with the rules, then work from leader to followers and equipment. This order prevents most blocked placements and keeps the Archive relevant to the company you are building.</p>
          </header>
          <ol>
            {builderSteps.map((step, index) => (
              <li id={`step-${index + 1}`} key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </li>
            ))}
          </ol>
          <a className={styles.startLink} href="#company-builder">Return to the Company Builder ↑</a>
        </section>

        <section className={styles.guideColumns}>
          <div>
            <p className={styles.guideEyebrow}>Practical tips</p>
            <h2>Make the board easier to work with</h2>
            <ul>
              <li><strong>Choose the week before filling the board.</strong> Changing it later may alter which positions are active.</li>
              <li><strong>Use Archive hover details before placing.</strong> The board itself stays clear while the source list provides inspection data.</li>
              <li><strong>Use click-to-carry for distant cells.</strong> It is the reliable alternative when a long drag would require scrolling.</li>
              <li><strong>Remove with the × control.</strong> Units, leaders, and equipped items can all be cleared without resetting the entire company.</li>
              <li><strong>Record uncertainties in Player notes.</strong> Treat the board as a draft that can be checked against the live game.</li>
            </ul>
          </div>
          <aside>
            <p className={styles.guideEyebrow}>Important scope</p>
            <h2>What the planner does—and does not verify</h2>
            <p>Placement limits are based on the project’s verified v0.302 rules layer. Individual public cards may retain their own source-version label, and records without complete public data remain marked as pending.</p>
            <p>This is an independent player tool. It records formation ideas but does not simulate combat, publish a tier ranking, or claim that a company is legal beyond the checks displayed by the builder.</p>
          </aside>
        </section>

        <section className={styles.builderFaq} aria-labelledby="builder-faq-title">
          <header><p className={styles.guideEyebrow}>Common questions</p><h2 id="builder-faq-title">Goodly Trials Builder FAQ</h2></header>
          <div>
            <article><h3>Why can’t I place a unit in every cell?</h3><p>Available cells depend on the selected trial week. A cell can also reject a drop when it is occupied or when the company has reached its current follower limit.</p></article>
            <article><h3>Why is a unit or item blocked in the Archive?</h3><p>The record may require a leader, a matching faction, an open follower slot, a unit already on the board, or compatible Gear or Trinket capacity. The disabled record displays its current reason.</p></article>
            <article><h3>Does the Builder save or share my formation?</h3><p>The plan saves automatically in the current browser on this device. It is not published as a public build and is not transferred automatically to another browser or device.</p></article>
            <article><h3>Where can I check the underlying game records?</h3><p>Use the <Link href="/wiki/units">unit archive</Link>, <Link href="/wiki/items">item archive</Link>, <Link href="/wiki/mechanics">mechanics archive</Link>, and <Link href="/guides/formation-guide">formation guide</Link> for the source-aware records and explanations behind the planner.</p></article>
          </div>
        </section>
      </article>
    </main>
  );
}
