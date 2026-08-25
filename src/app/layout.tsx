import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";
import { siteConfig } from "@/config/site";
import JsonLd from "@/seo/JsonLd";
import { pageTdk } from "@/seo/tdk";
import "@/style/globals.css";

const pixel = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: pageTdk["/"].title,
  description: pageTdk["/"].description,
  keywords: pageTdk["/"].keywords,
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Games",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon", sizes: "32x32" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/icon.png", type: "image/png", sizes: "32x32" }],
  },
  openGraph: { type: "website", siteName: siteConfig.name, locale: "en_US", title: pageTdk["/"].title, description: pageTdk["/"].description, url: "/", images: [{ url: siteConfig.socialImage, width: 1200, height: 630, alt: "Goodly Trials Wiki, Builds and Guides" }] },
  twitter: { card: "summary_large_image", title: pageTdk["/"].title, description: pageTdk["/"].description, images: [siteConfig.socialImage] },
  robots: siteConfig.indexable ? { index: true, follow: true } : { index: false, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={pixel.variable}>
      <body>
        <JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "WebSite", "@id": `${siteConfig.url}/#website`, url: siteConfig.url, name: siteConfig.name, description: siteConfig.description, inLanguage: "en", potentialAction: { "@type": "SearchAction", target: `${siteConfig.url}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } }, { "@type": "VideoGame", "@id": `${siteConfig.url}/#game`, name: "Goodly Trials", url: siteConfig.officialUrl, description: "A turn-based strategy game with roguelike and auto-battler elements.", genre: ["Turn-based strategy", "Roguelike", "Auto battler"], playMode: ["SinglePlayer", "MultiPlayer"], publisher: { "@type": "Organization", name: "Osborn Design Works" } }] }} />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <AppHeader />
        <div id="main-content">{children}</div>
        <AppFooter />
      </body>
    </html>
  );
}
