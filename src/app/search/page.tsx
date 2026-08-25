import type { Metadata } from "next";
import SearchPage from "@/page/search/SearchPage";
import { createMetadata } from "@/seo/metadata";
export const metadata: Metadata = createMetadata("Search", "Search the Goodly Trials Wiki.", "/search", { noIndex: true });

export default async function Page({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const raw = params.q;
  const query = Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
  return <SearchPage query={query} />;
}
