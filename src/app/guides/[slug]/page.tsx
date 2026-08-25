import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuide, getGuideDetail, guides } from "@/lib/data/game-content";
import GuideDetailPage from "@/page/guides/GuideDetailPage";
import { createMetadata } from "@/seo/metadata";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  return guide
    ? createMetadata(
        guide.tdk.title,
        guide.tdk.description,
        `/guides/${guide.slug}`,
        { type: "article", image: null, keywords: guide.tdk.keywords },
      )
    : {};
}

export default async function Page({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const detail = getGuideDetail(slug);
  if (!guide || !detail) notFound();
  return <GuideDetailPage guide={guide} detail={detail} />;
}
