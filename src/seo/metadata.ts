import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type MetadataOptions = {
  noIndex?: boolean;
  image?: string | null;
  type?: "website" | "article";
};

export function createMetadata(title: string, description: string, path: string, options: MetadataOptions = {}): Metadata {
  const image = options.image === undefined ? siteConfig.socialImage : options.image;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: options.noIndex || !siteConfig.indexable ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: options.type ?? "website",
      siteName: siteConfig.name,
      title,
      description,
      url: path,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}
