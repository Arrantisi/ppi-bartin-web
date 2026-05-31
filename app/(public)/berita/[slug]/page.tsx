import { NewsDetailComponent } from "@/features/news/components";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function PublicNewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  return <NewsDetailComponent slug={slug} readOnly={!session} />;
}