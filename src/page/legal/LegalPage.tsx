import type { CSSProperties } from "react";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import HeroIntel from "@/components/content/HeroIntel";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import { pageTdk } from "@/seo/tdk";
import styles from "@/style/page/archive/archive.module.css";

type LegalPageKey = "privacy-policy" | "terms-of-service" | "copyright" | "about-us" | "contact-us";

const content: Record<LegalPageKey, { title: string; eyebrow: string; sections: { heading: string; paragraphs: string[] }[] }> = {
  "privacy-policy": {
    title: "Privacy Policy",
    eyebrow: "Legal · privacy",
    sections: [
      { heading: "Scope", paragraphs: ["This Privacy Policy explains how Goodly Trials Wiki handles information when you visit goodlytrials.org. The site is an independent fan-made reference for Goodly Trials players and is not an official game service.", "This policy applies to pages, links, and features published on this site. It does not apply to the official game website, Steam, Discord, or any other third-party destination linked from a page here."] },
      { heading: "Information from ordinary visits", paragraphs: ["The site is designed to work without account registration, contact forms, player profiles, or user-submitted build data. A normal visit does not ask you to provide a name, payment detail, or game account information.", "Basic technical information may be processed by the hosting platform or your browser to deliver a webpage, prevent abuse, and understand whether a page is working. This can include IP address, browser type, device information, request time, and the page requested. The site does not use that information to identify individual players."] },
      { heading: "Builder plans on your device", paragraphs: ["The Company Builder saves its current draft in your browser's local storage. The saved company name, leader, followers, gear, week, mode, and notes remain on that device unless you clear the plan or browser storage.", "If you choose Copy share link, the same plan is encoded in the link itself. Anyone who receives that link can read and edit the included draft, so do not put private or sensitive information in player notes."] },
      { heading: "Cookies and external services", paragraphs: ["This site does not intentionally set advertising or tracking cookies. Your browser, a hosting provider, or a linked third-party service may use its own necessary cookies or similar technology under its own policy.", "External links open services outside goodlytrials.org. Review the privacy notices of those services before sharing information with them or accepting their cookies."] },
      { heading: "Changes and questions", paragraphs: ["This policy may change if site features or legal requirements change. The version published on this page is the current policy for the site.", "For a factual question about this policy, email wyong@goodlytrials.org. Do not send sensitive personal information by email."] },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    eyebrow: "Legal · terms",
    sections: [
      { heading: "Using this fan resource", paragraphs: ["Goodly Trials Wiki provides player-facing reference pages, guides, build ideas, and planning tools for general information. By using the site, you agree to use it lawfully and in a way that does not disrupt the site or other visitors.", "The site is not affiliated with, endorsed by, or operated by the developer, publisher, or rights holders of Goodly Trials. Official channels remain the authority for game access, account support, purchases, and live-game decisions."] },
      { heading: "Accuracy and player decisions", paragraphs: ["Game details can change through patches, regional releases, test environments, or incomplete public information. The site labels versions and unknown fields where possible, but cannot guarantee that every card, value, or recommendation is current at the moment you play.", "Builds, formation notes, and linked examples are player-oriented context, not a promise of a match result. You are responsible for checking the live game and making your own choices before spending in-game resources or entering a match."] },
      { heading: "Links and availability", paragraphs: ["The site may link to official pages and other third-party services for useful context. A link does not mean that this site controls, approves, or guarantees the destination, its content, or its availability.", "Pages may be updated, corrected, removed, or unavailable without notice as public game information changes or the site is maintained."] },
      { heading: "Contact", paragraphs: ["Questions about these terms can be sent to wyong@goodlytrials.org. This address is for website matters only and cannot provide official Goodly Trials support."] },
    ],
  },
  copyright: {
    title: "Copyright Notice",
    eyebrow: "Legal · copyright",
    sections: [
      { heading: "Original site material", paragraphs: ["Unless otherwise noted, the original written guides, page layouts, navigation, and editorial explanations on Goodly Trials Wiki are protected by applicable copyright and other laws. You may link to public pages and quote short portions with clear attribution and a link back to the relevant page.", "Do not reproduce substantial portions of this site, present its material as your own, or use it in a misleading way without prior written permission."] },
      { heading: "Game-related material", paragraphs: ["Goodly Trials names, artwork, game data, logos, screenshots, and other game-related marks may belong to their respective rights holders. They are used on this fan resource only to identify, discuss, and help players navigate the game.", "This site makes no claim of ownership over third-party game material. References to game content do not create an affiliation, endorsement, sponsorship, or partnership."] },
      { heading: "Rights-holder requests", paragraphs: ["If you own rights in material displayed here and believe a page should be corrected, credited, changed, or removed, email wyong@goodlytrials.org with the page URL, a description of the material, and enough information to understand the request.", "Good-faith requests will be reviewed and handled as reasonably as possible. Do not include unnecessary personal or confidential information."] },
    ],
  },
  "about-us": {
    title: "About Us",
    eyebrow: "Legal · about",
    sections: [
      { heading: "What this site is", paragraphs: ["Goodly Trials Wiki is an independent, fan-made player guide for Goodly Trials. It organizes publicly available unit, gear, leader, trait, faction, guide, build, and patch information into pages that are easier to compare while planning a run.", "The aim is practical clarity: preserve a link between a game detail and its related cards, show the version when it is known, and avoid filling missing information with invented stats or claims."] },
      { heading: "What this site is not", paragraphs: ["This is not an official Goodly Trials website, a game client, a support channel, or a source of account services. It is not affiliated with Osborn Design Works or any other Goodly Trials rights holder.", "Official game announcements, patch notes, storefront information, and support remain the appropriate place for authoritative live-game information."] },
      { heading: "Editorial approach", paragraphs: ["Pages distinguish recorded game information from player-facing interpretation. When an idea is a build suggestion or a planning note, it is presented as context for a player rather than as a guaranteed or official answer.", "If public source material is too thin to support a useful detail page, the site should keep that information in a list or a connected page instead of expanding it into unsupported filler."] },
    ],
  },
  "contact-us": {
    title: "Contact Us",
    eyebrow: "Legal · contact",
    sections: [
      { heading: "Website contact", paragraphs: ["For factual corrections, broken internal links, copyright questions, or general feedback about Goodly Trials Wiki, email wyong@goodlytrials.org.", "When reporting a game-data issue, include the page URL, the specific field or sentence that needs attention, and a public official source if one is available. This makes it easier to check a correction without guessing."] },
      { heading: "What this address cannot help with", paragraphs: ["This email address does not provide official game support, purchase support, account recovery, bug reporting for the game client, or Discord moderation. Contact the game team through its official channels for those matters.", "Please do not send passwords, payment details, account identifiers, or other sensitive personal information."] },
      { heading: "Response expectations", paragraphs: ["The site is maintained as a fan resource, so a response is not guaranteed and response times may vary. Clear reports about incorrect public information are the most useful kind of message."] },
    ],
  },
};

const legalHeroImages: Record<LegalPageKey, string> = {
  "privacy-policy": "/images/game/hero-wiki-v3.webp",
  "terms-of-service": "/images/game/hero-leaders-v3.webp",
  copyright: "/images/game/hero-gear-v3.webp",
  "about-us": "/images/game/hero-units-v3.webp",
  "contact-us": "/images/game/hero-guides-v3.webp",
};

export function legalMetadata(key: LegalPageKey) {
  const path = `/legal/${key}`;
  const tdk = pageTdk[path as keyof typeof pageTdk];
  return createMetadata(tdk.title, tdk.description, path, { keywords: tdk.keywords });
}

export default function LegalPage({ page }: { page: LegalPageKey }) {
  const document = content[page];
  return (
    <main>
      <section className={styles.hero} style={{ "--hero-image": `url("${legalHeroImages[page]}")` } as CSSProperties}>
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Legal" }, { label: document.title }]} />
          <p className={styles.eyebrow}>{document.eyebrow}</p>
          <h1>Goodly Trials Wiki - {document.title}</h1>
          <p>Information for visitors to {siteConfig.name}, an independent Goodly Trials fan resource.</p>
          <HeroIntel eyebrow="Site record" title={document.title} items={[{ value: document.sections.length, label: "Sections" }, { value: "Clear", label: "Language" }, { value: "Open", label: "Access" }, { value: "Fan-made", label: "Status" }]} />
        </div>
      </section>
      <article className={`container section ${styles.prose}`}>
        {document.sections.map((section) => <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>)}
      </article>
    </main>
  );
}
