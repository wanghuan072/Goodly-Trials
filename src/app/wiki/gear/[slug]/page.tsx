import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItem, items } from "@/lib/data/game-content";
import ItemDetailPage from "@/page/wiki/ItemDetailPage";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";

export function generateStaticParams() { return items.map((item) => ({ slug: item.slug })); }

export async function generateMetadata({ params }: PageProps<"/wiki/gear/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) return {};
  const image = item.image.startsWith("http") ? item.image : new URL(item.image, siteConfig.url).toString();
  return createMetadata(item.tdk.title, item.tdk.description, `/wiki/gear/${item.slug}`, { image, keywords: item.tdk.keywords });
}

export default async function Page({ params }: PageProps<"/wiki/gear/[slug]">) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();
  return <ItemDetailPage item={item} />;
}
