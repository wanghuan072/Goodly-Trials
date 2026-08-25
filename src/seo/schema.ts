import { siteConfig } from "@/config/site";
import { pageTdk } from "@/seo/tdk";

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "VideoGame",
      "@id": `${siteConfig.url}/#game`,
      name: "Goodly Trials",
      url: siteConfig.officialUrl,
      description: "A turn-based strategy game with roguelike and auto-battler elements.",
      genre: ["Turn-based strategy", "Roguelike", "Auto battler"],
      playMode: ["SinglePlayer", "MultiPlayer"],
      publisher: { "@type": "Organization", name: "Osborn Design Works" },
    },
  ],
};

export const homePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteConfig.url}/#webpage`,
  url: siteConfig.url,
  name: pageTdk["/"].title,
  description: pageTdk["/"].description,
  isPartOf: { "@id": `${siteConfig.url}/#website` },
  about: { "@id": `${siteConfig.url}/#game` },
  inLanguage: "en",
};
