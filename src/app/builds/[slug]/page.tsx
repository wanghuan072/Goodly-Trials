import { redirect } from "next/navigation";

export default async function Page({ params }: PageProps<"/builds/[slug]">) {
  const { slug } = await params;
  redirect(`/builds#${slug}`);
}
