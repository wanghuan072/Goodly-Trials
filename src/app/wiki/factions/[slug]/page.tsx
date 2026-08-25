import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { factions, getFaction } from "@/lib/data/game-content";
import FactionDetailPage from "@/page/wiki/FactionDetailPage";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";

export function generateStaticParams() {
  return factions.map((faction) => ({ slug: faction.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/wiki/factions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const faction = getFaction(slug);
  return faction
    ? createMetadata(
        faction.tdk.title,
        faction.tdk.description,
        `/wiki/factions/${faction.slug}`,
        {
          image: new URL(faction.image, siteConfig.url).toString(),
          keywords: faction.tdk.keywords,
        },
      )
    : {};
}

export default async function Page({
  params,
}: PageProps<"/wiki/factions/[slug]">) {
  const { slug } = await params;
  const faction = getFaction(slug);
  if (!faction) notFound();
  return <FactionDetailPage faction={faction} />;
}
