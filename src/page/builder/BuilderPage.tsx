import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import HeroIntel from "@/components/content/HeroIntel";
import { siteConfig } from "@/config/site";
import { items, leaders, units } from "@/lib/data/game-content";
import { leaderImage } from "@/lib/data/leader-images";
import JsonLd from "@/seo/JsonLd";
import { createMetadata } from "@/seo/metadata";
import BuilderClient from "./BuilderClient";
import type { BuilderLeader, BuilderRosterUnit } from "@/types/builder";
import styles from "@/style/page/builder/builder.module.css";

export const metadata = createMetadata(
  "Goodly Trials Builder – Team Builder & Formation Planner",
  "Plan a Goodly Trials company with a game-inspired formation board. Choose a leader, place units, try gear, and save notes on this device.",
  "/builder",
);

const builderSteps = [
  {
    title: "Set the rules for your run",
    text: "Choose the game mode and trial week first. The week controls which board cells are active, while the selected ruleset determines the follower limit used by the planner.",
  },
  {
    title: "Choose a company leader",
    text: "Open Leaders in the card list and drag a leader to the leader slot, or click the leader once. In non-multiplayer modes, the list then narrows to followers from that leader’s faction.",
  },
  {
    title: "Place followers on active cells",
    text: "Drag units from the card list onto open cells. For a long move, click a unit, scroll normally, and click the target cell. Locked cards explain whether a leader, faction match, open cell, or roster space is required.",
  },
  {
    title: "Assign gear and trinkets",
    text: "Switch to Gear and drag an item onto a compatible unit card. Equipment is limited by that unit’s known Gear and Trinket capacity, and equipped items can be moved or removed.",
  },
  {
    title: "Inspect, adjust, and record the plan",
    text: "Hover or focus a card to review its available details, move units between open cells, and add notes. The current plan saves automatically on this device.",
  },
] as const;

const roster: BuilderRosterUnit[] = units.map((unit) => ({
  slug: unit.slug,
  name: unit.name,
  faction: unit.faction,
  factionSlug: unit.factionSlug,
  accent: unit.accent,
  image: unit.image,
  verified: true,
  cost: unit.cost,
  gear: unit.gear,
  trinkets: unit.trinkets,
  stats: unit.stats,
  trait: unit.trait.name,
  gameVersion: unit.gameVersion,
  traitEffect: unit.trait.effect,
  baseEffects: unit.baseEffects,
  tactic: unit.tactic.name,
  tacticEffect: unit.tactic.effect,
  skills: unit.skills,
  quote: unit.quote,
  recovery: unit.recovery,
  manaRegen: unit.manaRegen,
}));

const builderLeaders: BuilderLeader[] = leaders.map((leader) => ({
  slug: leader.slug,
  name: leader.name,
  epithet: leader.epithet,
  faction: leader.faction,
  factionSlug: leader.factionSlug,
  image: leaderImage(leader.slug),
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
            description: "A free browser-based Goodly Trials formation planner for choosing a leader, positioning units, trying gear, and recording player notes.",
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
        <Image
          className={styles.heroImage}
          src="/images/game/hero-builder-v3.webp"
          alt="A company assembling on a moonlit ruined courtyard before battle"
          fill
          sizes="100vw"
        />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Company Builder" }]} />
          <p className={styles.eyebrow}>Player planner · formation and loadout workspace</p>
          <h1>Goodly Trials Builder - Plan Your Company</h1>
          <p>Choose a leader, arrange the units available to you, and try equipment on a game-inspired board before your next run. Your notes stay in this browser so you can keep adjusting the plan.</p>
          <HeroIntel eyebrow="Builder workflow" title="Assemble the company" items={[{ value: "01", label: "Choose leader" }, { value: "02", label: "Place followers" }, { value: "03", label: "Assign gear" }, { value: "04", label: "Save notes" }]} />
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
            <h3>Cards and guesses stay separate</h3>
            <p>Leader, unit, and gear details that can be checked are shown inside the planner. When a card is incomplete, the missing information stays clearly marked.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Drag when convenient; click for long moves</h3>
            <p>Desktop players can drag cards directly. If the destination is farther down the board, click a card to carry it, scroll normally, then click the target—no precision drag across the whole page is required.</p>
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
          <figcaption><strong>Why position matters:</strong> the game screen puts formation, unit cards, gear, and inspection details in the same decision space. This Builder follows that planning flow before you take the idea into a match.</figcaption>
        </figure>

        <section className={styles.howTo} aria-labelledby="builder-how-to">
          <header>
            <p className={styles.guideEyebrow}>Five-step workflow</p>
            <h2 id="builder-how-to">How to use the Goodly Trials Company Builder</h2>
            <p>Start with the rules, then work from leader to followers and equipment. This order prevents most blocked placements and keeps the card list relevant to the company you are building.</p>
          </header>
          <ol>
            {builderSteps.map((step, index) => (
              <li id={`step-${index + 1}`} key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.guideColumns}>
          <div>
            <p className={styles.guideEyebrow}>Practical tips</p>
            <h2>Make the board easier to work with</h2>
            <ul>
              <li><strong>Choose the week before filling the board.</strong> Changing it later may alter which positions are active.</li>
              <li><strong>Check card details before placing.</strong> The board stays clear while the list gives you the information you need.</li>
              <li><strong>Use click-to-carry for distant cells.</strong> It is the reliable alternative when a long drag would require scrolling.</li>
              <li><strong>Remove with the × control.</strong> Units, leaders, and equipped items can all be cleared without resetting the entire company.</li>
              <li><strong>Record uncertainties in Player notes.</strong> Treat the board as a draft that can be checked against the live game.</li>
            </ul>
          </div>
          <aside>
            <p className={styles.guideEyebrow}>Important scope</p>
            <h2>What the planner does—and does not verify</h2>
            <p>The planner checks active cells, follower limits, faction requirements, occupied positions, and known equipment capacity while you work.</p>
            <p>It organizes a company draft; it does not simulate combat, publish rankings, or predict match results.</p>
          </aside>
        </section>

        <section className={styles.builderFaq} aria-labelledby="builder-faq-title">
          <header><p className={styles.guideEyebrow}>Common questions</p><h2 id="builder-faq-title">Goodly Trials Builder FAQ</h2></header>
          <div>
            <article><h3>Why can’t I place a unit in every cell?</h3><p>Available cells depend on the selected trial week. A cell can also reject a drop when it is occupied or when the company has reached its current follower limit.</p></article>
            <article><h3>Why is a unit or item blocked in the list?</h3><p>It may require a leader, a matching faction, an open follower slot, a unit already on the board, or compatible Gear or Trinket capacity. The disabled card shows why.</p></article>
            <article><h3>Does the Builder save or share my formation?</h3><p>The plan saves automatically in the current browser. Use Copy share link to transfer the current draft to another browser or send it to another player; the link imports an editable copy and does not publish a public build.</p></article>
            <article><h3>Where can I check the game details?</h3><p>Use the <Link href="/wiki/units">unit pages</Link>, <Link href="/wiki/gear">gear pages</Link>, and <Link href="/guides">player guides</Link> when you want to check the cards behind a plan.</p></article>
          </div>
        </section>
      </article>
    </main>
  );
}
