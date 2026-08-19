import type { Metadata } from "next";
import { notFound } from "next/navigation";
import buildDetails from "@/data/game/build-details.json";
import { getBuild, getUnit, builds } from "@/lib/data/game-content";
import BuildDetailPage from "@/page/builds/BuildDetailPage";
import { createMetadata } from "@/seo/metadata";
export function generateStaticParams() { return builds.map((build) => ({ slug: build.slug })); }
export async function generateMetadata({ params }: PageProps<"/builds/[slug]">): Promise<Metadata> { const { slug } = await params; const build = getBuild(slug); return build ? createMetadata(build.title, build.summary, `/builds/${build.slug}`, { type: "article", image: null }) : {}; }
export default async function Page({ params }: PageProps<"/builds/[slug]">) { const { slug } = await params; const build = getBuild(slug); const detail = buildDetails.find((entry) => entry.slug === slug); const unit = build ? getUnit(build.unitSlug) : undefined; if (!build || !detail || !unit) notFound(); return <BuildDetailPage build={build} unit={unit} detail={detail} />; }
