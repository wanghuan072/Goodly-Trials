import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUnit, units } from "@/lib/data/game-content";
import UnitDetailPage from "@/page/wiki/UnitDetailPage";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";

export function generateStaticParams() { return units.map((unit) => ({ slug: unit.slug })); }

export async function generateMetadata({ params }: PageProps<"/wiki/units/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const unit = getUnit(slug);
  if (!unit) return {};
  return createMetadata(`${unit.name} – Stats, Trait & Tactics`, `${unit.name} stats, ${unit.trait.name} trait, ${unit.tactic.name} tactic, item notes, and source history for ${unit.gameVersion}.`, `/wiki/units/${unit.slug}`, { image: new URL(unit.image, siteConfig.url).toString() });
}

export default async function Page({ params }: PageProps<"/wiki/units/[slug]">) {
  const { slug } = await params;
  const unit = getUnit(slug);
  if (!unit) notFound();
  return <UnitDetailPage unit={unit} />;
}
