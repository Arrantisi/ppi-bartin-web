import { NewsDetailComponent } from "@/features/news/components";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { absoluteUrl, defaultOgImage } from "@/lib/og";
import { imageUrl } from "@/utils/image-url";

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

  // Fungsi helper untuk menghilangkan tag HTML
  function stripHtml(html: string) {
    return html
      .replace(/<[^>]*>/g, '') // Menghapus semua tag HTML seperti <p>, </p>, dll.
      .replace(/\s+/g, ' ')    // Mengubah multiple spasi/newline menjadi satu spasi biasa
      .trim();                 // Menghapus spasi di awal dan akhir
  }

  const description = stripHtml(news.desckripsi).substring(0, 200) + "...";

  const ogImage = news.fileKey
    ? { url: imageUrl(news.fileKey), width: 1200, height: 630, alt: news.judul }
    : defaultOgImage;

  return {
    title: news.judul,
    description,
    openGraph: {
      title: news.judul,
      description,
      url: absoluteUrl(`/berita/${slug}`),
      type: "article",
      publishedTime: news.createdAt.toISOString(),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: news.judul,
      description,
      images: [ogImage.url],
    },
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