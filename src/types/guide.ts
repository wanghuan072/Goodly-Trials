import type { ContentTdk } from "@/types/seo";

export type Guide = {
  slug: string;
  title: string;
  category: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  updated: string;
  tdk: ContentTdk;
};

export type GuideDetail = {
  slug: string;
  quickAnswer: string;
  sections: {
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  media?: {
    afterSection: number;
    src: string;
    alt: string;
    caption: string;
  }[];
};
