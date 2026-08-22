import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { pageTdk } from "@/seo/tdk";

type MetadataOptions = {
  noIndex?: boolean;
  image?: string | null;
  type?: "website" | "article";
  keywords?: string[];
};

export function createMetadata(title: string, description: string, path: string, options: MetadataOptions = {}): Metadata {
  const tdk = pageTdk[path as keyof typeof pageTdk] ?? { title, description, keywords: options.keywords ?? [] };
  const image = options.image === undefined ? siteConfig.socialImage : options.image;
  return {
    title: tdk.title,
    description: tdk.description,
    keywords: tdk.keywords,
    alternates: { canonical: path },
    robots: options.noIndex || !siteConfig.indexable ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: options.type ?? "website",
      siteName: siteConfig.name,
      title: tdk.title,
      description: tdk.description,
      url: path,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: tdk.title,
      description: tdk.description,
      images: image ? [image] : [],
    },
  };
}
