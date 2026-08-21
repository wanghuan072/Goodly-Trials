import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLeader, leaders } from "@/lib/data/game-content";
import LeaderDetailPage from "@/page/wiki/LeaderDetailPage";
import { createMetadata } from "@/seo/metadata";

export function generateStaticParams() { return leaders.map((leader) => ({ slug: leader.slug })); }

export async function generateMetadata({ params }: PageProps<"/wiki/leaders/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const leader = getLeader(slug);
  if (!leader) return {};
  return createMetadata(`${leader.name} – Leader Stats & Trait`, `${leader.name} leader-card stats, ${leader.trait.name} trait, equipment slots, and source history for ${leader.gameVersion}.`, `/wiki/leaders/${leader.slug}`, { image: null });
}

export default async function Page({ params }: PageProps<"/wiki/leaders/[slug]">) {
  const { slug } = await params;
  const leader = getLeader(slug);
  if (!leader) notFound();
  return <LeaderDetailPage leader={leader} />;
}
