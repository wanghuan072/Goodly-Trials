const fillDescription = (copy) => {
  const normalized = copy.replace(/\s+/g, " ").trim();
  if (normalized.length >= 140 && normalized.length <= 160) return normalized;
  if (normalized.length < 140) {
    return `${normalized} Check the listed version before relying on an older note.`.slice(0, 160);
  }
  const shortened = normalized.slice(0, 160);
  return `${shortened.slice(0, shortened.lastIndexOf(" ")).replace(/[,:;]$/, "")}.`;
};

const detailDescription = (name, topic) => fillDescription(
  `${name} Goodly Trials ${topic} with current public data, linked cards, and practical context for comparing a company before you commit to your next run.`,
);

const detailTitle = (name, suffix, shorterSuffix = suffix) => {
  let title = `${name} - Goodly Trials ${suffix}`;
  if (title.length > 60) title = `${name} - Goodly Trials ${shorterSuffix}`;
  if (title.length < 40) title = `${title} Guide`;
  return title;
};

const pageTdkRecords = {
  "/": { title: "Goodly Trials - Wiki, Builder, Guides and Updates", description: "Plan a Goodly Trials run with current unit cards, gear effects, editable formations, player guides, build ideas, and versioned patch changes in one practical fan wiki.", keywords: ["Goodly Trials", "Goodly Trials wiki", "Goodly Trials builder", "Goodly Trials guides"] },
  "/wiki": { title: "Goodly Trials Wiki - Units, Gear, Leaders and Traits", description: "Browse the Goodly Trials wiki for public unit stats, gear effects, leaders, traits, factions, and linked player notes that help you compare cards before planning a run.", keywords: ["Goodly Trials wiki", "Goodly Trials units", "Goodly Trials gear", "Goodly Trials traits"] },
  "/wiki/units": { title: "Goodly Trials Units - Stats, Traits and Tactics", description: "Compare Goodly Trials unit stats, traits, tactics, skills, gear slots, and related card pages. Check the listed version before using a unit in a new company plan.", keywords: ["Goodly Trials units", "Goodly Trials unit stats", "Goodly Trials traits", "Goodly Trials tactics"] },
  "/wiki/gear": { title: "Goodly Trials Gear - Effects, Costs and Requirements", description: "Check Goodly Trials weapons, shields, trinkets, spells, and potions by effect, requirement, cost, and version. Use the gear list to make clearer shop and build choices.", keywords: ["Goodly Trials gear", "Goodly Trials items", "Goodly Trials weapons", "Goodly Trials potions"] },
  "/wiki/leaders": { title: "Goodly Trials Leaders - Stats, Slots and Starting Traits", description: "Review Goodly Trials leader cards with public starting stats, equipment slots, traits, factions, and version notes. Compare a leader before you begin a formation or build plan.", keywords: ["Goodly Trials leaders", "Goodly Trials leader stats", "Goodly Trials starting traits"] },
  "/wiki/traits": { title: "Goodly Trials Traits - Effects, Caps and Unit Links", description: "See public Goodly Trials trait effects, limits, and connected unit cards in one list. Use the links to understand which trait text applies before you move or equip a unit.", keywords: ["Goodly Trials traits", "Goodly Trials trait effects", "Goodly Trials unit traits"] },
  "/wiki/factions": { title: "Goodly Trials Factions - Rosters, Themes and Playstyles", description: "Explore Goodly Trials factions, public roster names, board themes, and linked unit pages. Use faction context to compare company ideas without treating a theme as a guaranteed strategy.", keywords: ["Goodly Trials factions", "Goodly Folk", "Bone Host", "Belowborn"] },
  "/guides": { title: "Goodly Trials Guides - Better Shop and Board Decisions", description: "Read practical Goodly Trials guides for first shops, formation choices, tactics, progression, and game modes. Each guide links back to the cards and rules it discusses.", keywords: ["Goodly Trials guides", "Goodly Trials beginner guide", "Goodly Trials formation guide"] },
  "/builder": { title: "Goodly Trials Builder - Plan Your Team and Formation", description: "Use the Goodly Trials Builder to place public unit cards, move gear, test a formation, and save a shareable planning link before taking the same idea into a run.", keywords: ["Goodly Trials builder", "Goodly Trials team builder", "Goodly Trials formation builder"] },
  "/builds": { title: "Goodly Trials Builds - Team Ideas for Your Next Run", description: "Browse editable Goodly Trials build ideas with strengths, tradeoffs, unit placement, and gear context. Open any idea in the Builder and adjust it for your own board.", keywords: ["Goodly Trials builds", "Goodly Trials team builds", "Goodly Trials formation ideas"] },
  "/updates": { title: "Goodly Trials Updates - Patch Changes for Players", description: "Follow selected Goodly Trials patch changes for units, gear, leaders, combat, and training. Each entry keeps the practical impact clear and links to the official patch note.", keywords: ["Goodly Trials updates", "Goodly Trials patch notes", "Goodly Trials changes"] },
  "/about": { title: "About Goodly Trials Wiki - A Player-Made Guide", description: "Learn how the Goodly Trials Wiki presents public game data, versioned updates, player builds, and linked guides. This independent fan site is not affiliated with the game team.", keywords: ["Goodly Trials Wiki", "Goodly Trials fan site", "Goodly Trials player guide"] },
  "/search": { title: "Search Goodly Trials Wiki - Units, Gear and Guides", description: "Search the Goodly Trials Wiki for public unit cards, gear, traits, leaders, guides, builds, and patch notes. Results point to the page that best matches your game question.", keywords: ["Search Goodly Trials", "Goodly Trials wiki search"] },
  "/legal/privacy-policy": { title: "Privacy Policy - Goodly Trials Wiki Fan Site", description: "Read the Goodly Trials Wiki privacy policy, including how ordinary site visits, external links, and future service changes are handled by this independent fan-made resource.", keywords: ["Goodly Trials Wiki privacy policy", "Goodly Trials privacy"] },
  "/legal/terms-of-service": { title: "Terms of Service - Goodly Trials Wiki Fan Site", description: "Read the Goodly Trials Wiki terms of service for using guides, data pages, builds, and external links. The site is an independent fan resource, not an official game service.", keywords: ["Goodly Trials Wiki terms", "Goodly Trials fan site terms"] },
  "/legal/copyright": { title: "Copyright Notice - Goodly Trials Wiki Fan Site", description: "Read the Goodly Trials Wiki copyright notice covering original site writing, third-party game references, and how rights holders can contact this independent fan-made resource.", keywords: ["Goodly Trials Wiki copyright", "Goodly Trials copyright notice"] },
  "/legal/about-us": { title: "About Us - Goodly Trials Wiki Fan Resource", description: "Learn about Goodly Trials Wiki, an independent player-made resource that organizes public game details, connected guides, build notes, and patch information for practical reference.", keywords: ["About Goodly Trials Wiki", "Goodly Trials fan resource"] },
  "/legal/contact-us": { title: "Contact Goodly Trials Wiki - Player Guide Support", description: "Contact the Goodly Trials Wiki about factual corrections, broken links, copyright questions, or site feedback. This fan-made player guide does not provide official game support.", keywords: ["Contact Goodly Trials Wiki", "Goodly Trials guide contact"] },
};

export const pageTdk = Object.fromEntries(
  Object.entries(pageTdkRecords).map(([path, tdk]) => [path, { ...tdk, description: fillDescription(tdk.description) }]),
);

export const detailTdk = {
  unit: (unit) => ({ title: detailTitle(unit.name, "Unit Stats and Traits"), description: detailDescription(unit.name, "unit guide covers stats, traits, tactics, skills, and equipment slots"), keywords: [unit.name, "Goodly Trials units", "Goodly Trials unit stats"] }),
  item: (item) => ({ title: detailTitle(item.name, "Gear Effects and Cost", "Gear Details"), description: detailDescription(item.name, "gear guide covers effects, requirements, cost status, and related unit pages"), keywords: [item.name, "Goodly Trials gear", "Goodly Trials items"] }),
  leader: (leader) => ({ title: detailTitle(leader.name, "Leader Stats and Trait"), description: detailDescription(leader.name, "leader guide covers starting stats, equipment slots, trait text, and faction context"), keywords: [leader.name, "Goodly Trials leaders", "Goodly Trials leader stats"] }),
  faction: (faction) => ({ title: detailTitle(faction.name, "Faction Guide Wiki"), description: detailDescription(faction.name, "faction guide covers public roster names, board themes, and linked unit information"), keywords: [faction.name, "Goodly Trials factions", "Goodly Trials wiki"] }),
  guide: (guide) => ({ title: detailTitle(guide.title, "Guide"), description: detailDescription(guide.title, "player guide explains the public cards, board choices, and practical checks related to this topic"), keywords: [guide.title, "Goodly Trials guides", "Goodly Trials strategy"] }),
};
