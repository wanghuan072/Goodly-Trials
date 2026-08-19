import type { Metadata } from "next";
import { notFound } from "next/navigation";
import mechanicsData from "@/data/game/mechanics.json";
import MechanicDetailPage from "@/page/wiki/MechanicDetailPage";
import { createMetadata } from "@/seo/metadata";
export function generateStaticParams() { return mechanicsData.map((entry) => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: PageProps<"/wiki/mechanics/[slug]">): Promise<Metadata> { const { slug } = await params; const entry = mechanicsData.find((item) => item.slug === slug); return entry ? createMetadata(entry.title, entry.summary, `/wiki/mechanics/${entry.slug}`) : {}; }
export default async function Page({ params }: PageProps<"/wiki/mechanics/[slug]">) { const { slug } = await params; const entry = mechanicsData.find((item) => item.slug === slug); if (!entry) notFound(); return <MechanicDetailPage mechanic={entry} />; }
