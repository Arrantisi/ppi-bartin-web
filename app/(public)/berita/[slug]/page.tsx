import { NewsDetailComponent } from "@/features/news/components";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await prisma.news.findUnique({ where: { slug } });

  if (!news) {
    return { title: "Berita Tidak Ditemukan", description: "Berita tidak ditemukan" };
  }

  return {
    title: news.judul,
    description: news.ringkasan,
  };
}

export default async function PublicNewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  return <NewsDetailComponent slug={slug} readOnly={!session} />;
}