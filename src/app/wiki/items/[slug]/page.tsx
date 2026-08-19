import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItem, items } from "@/lib/data/game-content";
import ItemDetailPage from "@/page/wiki/ItemDetailPage";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";

export function generateStaticParams() { return items.map((item) => ({ slug: item.slug })); }

export async function generateMetadata({ params }: PageProps<"/wiki/items/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) return {};
  return createMetadata(`${item.name} – Effects, Cost & Unit Fit`, `${item.name} requirements, effects, ${item.cost}G cost, editorial unit fit, and verified source data for ${item.gameVersion}.`, `/wiki/items/${item.slug}`, { image: new URL(item.image, siteConfig.url).toString() });
}

export default async function Page({ params }: PageProps<"/wiki/items/[slug]">) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();
  return <ItemDetailPage item={item} />;
}
