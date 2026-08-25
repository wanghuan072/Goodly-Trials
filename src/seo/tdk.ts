import type { ContentTdk } from "@/types/seo";

const TRAILING_CONNECTOR = /\s+\b(?:a|an|and|at|by|for|from|in|of|on|or|the|to|with)$/i;

const truncateDescription = (copy: string, maximum = 160) => {
  if (copy.length <= maximum) return copy;

  const window = copy.slice(0, maximum);
  const lastSpace = window.lastIndexOf(" ");
  let shortened = (lastSpace > 0 ? window.slice(0, lastSpace) : window).replace(/[,:;.!?]+$/, "");
  while (TRAILING_CONNECTOR.test(shortened)) shortened = shortened.replace(TRAILING_CONNECTOR, "");
  return `${shortened}.`;
};

export const fillDescription = (copy: string) => {
  let normalized = copy.replace(/\s+/g, " ").trim();
  const additions = [
    " Check the documented version before relying on an older note.",
    " Compare linked records before planning a company.",
  ];

  for (const addition of additions) {
    if (normalized.length >= 140) break;
    normalized += addition;
  }

  return truncateDescription(normalized);
};

const detailDescription = (name: string, topic: string) => fillDescription(
  `${name} Goodly Trials ${topic} with documented public data, linked cards, and practical context for comparing a company before you commit to your next run.`,
);

const detailTitle = (name: string, suffix: string, shorterSuffix = suffix) => {
  let title = `${name} - Goodly Trials ${suffix}`;
  if (title.length > 60) title = `${name} - Goodly Trials ${shorterSuffix}`;
  if (title.length < 40) title = `${title} Guide`;
  return title;
};

const pageTdkRecords = {
  "/": { title: "Goodly Trials - Guide, Units, Gear & Builds", description: "Plan a Goodly Trials run with documented unit cards, gear effects, editable formations, player guides, build ideas, and patch changes in one practical fan wiki.", keywords: ["Goodly Trials", "Goodly Trials wiki", "Goodly Trials builder", "Goodly Trials builds"] },
  "/wiki": { title: "Goodly Trials Wiki - Units, Gear & Factions", description: "Browse the Goodly Trials wiki for documented unit stats, gear effects, leaders, traits, factions, and player notes that help you compare cards before planning a run.", keywords: ["Goodly Trials wiki", "Goodly Trials units", "Goodly Trials gear", "Goodly Trials factions"] },
  "/wiki/units": { title: "Goodly Trials Units - Stats, Traits & Tactics", description: "Compare Goodly Trials unit stats, traits, tactics, skills, gear slots, and related card pages before placing a unit in a company plan.", keywords: ["Goodly Trials units", "Goodly Trials unit stats", "Goodly Trials traits", "Goodly Trials tactics"] },
  "/wiki/gear": { title: "Goodly Trials Gear - Items, Weapons & Trinkets", description: "Check Goodly Trials weapons, shields, trinkets, spells, and potions by effect, requirement, cost, and documented version before a shop decision.", keywords: ["Goodly Trials gear", "Goodly Trials items", "Goodly Trials weapons", "Goodly Trials trinkets"] },
  "/wiki/leaders": { title: "Goodly Trials Leaders - Stats, Traits & Builds", description: "Review Goodly Trials leader cards with documented starting stats, equipment slots, traits, factions, and version notes before planning a formation.", keywords: ["Goodly Trials leaders", "Goodly Trials leader stats", "Goodly Trials leader traits"] },
  "/wiki/traits": { title: "Goodly Trials Traits - Effects & Unit Synergies", description: "See documented Goodly Trials trait effects, limits, and connected unit cards in one list before you move or equip a unit.", keywords: ["Goodly Trials traits", "Goodly Trials trait effects", "Goodly Trials unit synergies"] },
  "/wiki/factions": { title: "Goodly Trials Factions - Rosters & Units", description: "Explore Goodly Trials factions, documented roster names, board themes, and linked unit pages for comparing company ideas.", keywords: ["Goodly Trials factions", "Goodly Folk", "Bone Host", "Belowborn"] },
  "/guides": { title: "Goodly Trials Guides - Tactics, Builds & Game Modes", description: "Read practical Goodly Trials guides for first shops, formations, tactics, builds, progression, and game modes. Each guide links to the cards and rules it discusses.", keywords: ["Goodly Trials guides", "Goodly Trials beginner guide", "Goodly Trials formation guide"] },
  "/builder": { title: "Goodly Trials Builder - Plan Your Company", description: "Use the Goodly Trials Builder to place documented unit cards, move gear, test a formation, and save a planning link before taking the idea into a run.", keywords: ["Goodly Trials builder", "Goodly Trials team builder", "Goodly Trials formation builder"] },
  "/builds": { title: "Goodly Trials Builds - Team Comps & Formations", description: "Browse editable Goodly Trials team compositions with strengths, tradeoffs, unit placement, and gear context, then adjust any idea in the Builder.", keywords: ["Goodly Trials builds", "Goodly Trials team comps", "Goodly Trials formations"] },
  "/updates": { title: "Goodly Trials Updates - Patch Notes & Changes", description: "Follow selected Goodly Trials patch changes for units, gear, leaders, combat, and training, with the practical impact and official source kept together.", keywords: ["Goodly Trials updates", "Goodly Trials patch notes", "Goodly Trials changes"] },
  "/about": { title: "Goodly Trials Wiki - Player Guide & Tools", description: "Learn how the Goodly Trials Wiki presents documented game data, versioned updates, player builds, and linked guides as an independent fan resource.", keywords: ["Goodly Trials Wiki", "Goodly Trials fan site", "Goodly Trials player guide"] },
  "/search": { title: "Goodly Trials - Search Units, Gear & Guides", description: "Search the Goodly Trials Wiki for documented unit cards, gear, traits, leaders, guides, builds, and patch notes.", keywords: ["Search Goodly Trials", "Goodly Trials wiki search"] },
  "/legal/privacy-policy": { title: "Goodly Trials Wiki - Privacy Policy", description: "Read the Goodly Trials Wiki privacy policy, including how ordinary visits, external links, and future service changes are handled by this fan-made resource.", keywords: ["Goodly Trials Wiki privacy policy", "Goodly Trials privacy"] },
  "/legal/terms-of-service": { title: "Goodly Trials Wiki - Terms of Service", description: "Read the Goodly Trials Wiki terms of service for using guides, data pages, builds, and external links on this independent fan resource.", keywords: ["Goodly Trials Wiki terms", "Goodly Trials fan site terms"] },
  "/legal/copyright": { title: "Goodly Trials Wiki - Copyright Notice", description: "Read the Goodly Trials Wiki copyright notice covering original writing, third-party game references, and rights-holder contact requests.", keywords: ["Goodly Trials Wiki copyright", "Goodly Trials copyright notice"] },
  "/legal/about-us": { title: "Goodly Trials Wiki - About Us", description: "Learn about Goodly Trials Wiki, an independent player-made resource that organizes documented game details, connected guides, build notes, and patch information.", keywords: ["About Goodly Trials Wiki", "Goodly Trials fan resource"] },
  "/legal/contact-us": { title: "Goodly Trials Wiki - Contact Us", description: "Contact the Goodly Trials Wiki about factual corrections, broken links, copyright questions, or site feedback. This fan-made player guide does not provide official support.", keywords: ["Contact Goodly Trials Wiki", "Goodly Trials guide contact"] },
} satisfies Record<string, ContentTdk>;

export const pageTdk = Object.fromEntries(
  Object.entries(pageTdkRecords).map(([path, tdk]) => [path, { ...tdk, description: fillDescription(tdk.description) }]),
);

export const detailTdk = {
  unit: (unit: { name: string }): ContentTdk => ({ title: detailTitle(unit.name, "Unit Stats and Traits"), description: detailDescription(unit.name, "unit guide covers stats, traits, tactics, skills, and equipment slots"), keywords: [unit.name, "Goodly Trials units", "Goodly Trials unit stats"] }),
  item: (item: { name: string }): ContentTdk => ({ title: detailTitle(item.name, "Gear Effects and Cost", "Gear Details"), description: detailDescription(item.name, "gear guide covers effects, requirements, cost status, and related unit pages"), keywords: [item.name, "Goodly Trials gear", "Goodly Trials items"] }),
  leader: (leader: { name: string }): ContentTdk => ({ title: detailTitle(leader.name, "Leader Stats and Trait"), description: detailDescription(leader.name, "leader guide covers starting stats, equipment slots, trait text, and faction context"), keywords: [leader.name, "Goodly Trials leaders", "Goodly Trials leader stats"] }),
  faction: (faction: { name: string }): ContentTdk => ({ title: detailTitle(faction.name, "Faction Guide Wiki"), description: detailDescription(faction.name, "faction guide covers public roster names, board themes, and linked unit information"), keywords: [faction.name, "Goodly Trials factions", "Goodly Trials wiki"] }),
  guide: (guide: { title: string }): ContentTdk => ({ title: detailTitle(guide.title, "Guide"), description: detailDescription(guide.title, "player guide explains the public cards, board choices, and practical checks related to this topic"), keywords: [guide.title, "Goodly Trials guides", "Goodly Trials strategy"] }),
};
