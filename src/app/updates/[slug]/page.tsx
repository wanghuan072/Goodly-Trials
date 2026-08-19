import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUpdate, updates } from "@/lib/data/game-content";
import UpdateDetailPage from "@/page/updates/UpdateDetailPage";
import { createMetadata } from "@/seo/metadata";
export const revalidate = 86400;
export function generateStaticParams() { return updates.map((update) => ({ slug: update.slug })); }
export async function generateMetadata({ params }: PageProps<"/updates/[slug]">): Promise<Metadata> { const { slug } = await params; const update = getUpdate(slug); return update ? createMetadata(`${update.version} – ${update.title}`, `${update.summary} Independent impact notes for the Goodly Trials Wiki.`, `/updates/${update.slug}`, { type: "article", image: null }) : {}; }
export default async function Page({ params }: PageProps<"/updates/[slug]">) { const { slug } = await params; const update = getUpdate(slug); if (!update) notFound(); return <UpdateDetailPage update={update} />; }
