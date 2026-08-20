import type { Metadata } from "next";
import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";
import { siteConfig } from "@/config/site";
import JsonLd from "@/seo/JsonLd";
import "@/style/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Goodly Trials Wiki – Units, Items, Builds & Guides", template: "%s | Goodly Trials Wiki" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: siteConfig.name, title: "Goodly Trials Wiki – Units, Items, Builds & Guides", description: siteConfig.description, url: "/", images: [{ url: siteConfig.socialImage }] },
  twitter: { card: "summary_large_image", title: "Goodly Trials Wiki – Units, Items, Builds & Guides", description: siteConfig.description, images: [siteConfig.socialImage] },
  robots: siteConfig.indexable ? { index: true, follow: true } : { index: false, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body><JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "WebSite", "@id": `${siteConfig.url}/#website`, url: siteConfig.url, name: siteConfig.name, description: siteConfig.description, inLanguage: "en" }, { "@type": "VideoGame", "@id": `${siteConfig.url}/#game`, name: "Goodly Trials", url: siteConfig.officialUrl, description: "A turn-based strategy game with roguelike and auto-battler elements.", genre: ["Turn-based strategy", "Roguelike", "Auto battler"], playMode: ["SinglePlayer", "MultiPlayer"], publisher: { "@type": "Organization", name: "Osborn Design Works" } }] }} /><a className="skip-link" href="#main-content">Skip to content</a><AppHeader /><div id="main-content">{children}</div><AppFooter /></body></html>;
}
