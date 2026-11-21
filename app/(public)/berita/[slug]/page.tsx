import { NewsDetailComponent } from "@/features/news/components";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { safeDb } from "@/lib/db/safe";
import { getNewsBySlug } from "@/server/data/news";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { absoluteUrl, defaultOgImage } from "@/lib/og";
import { imageUrl } from "@/utils/image-url";
import { toMetaDescription } from "@/utils/meta-description";

// Sengaja TIDAK ada generateStaticParams / revalidate di sini.
// Lihat catatan identik di /acara/[eventSlug]/page.tsx: body halaman
// memanggil headers() sehingga route wajib dinamis.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await safeDb(
    () => prisma.news.findUnique({ where: { slug } }),
    null,
    "berita/[slug] metadata",
  );

  // Query gagal ≠ berita tidak ada — jangan beri metadata "Tidak Ditemukan".
  if (!news) {
    return { title: "Berita", description: "Berita PPI Bartın" };
  }

  const description = toMetaDescription(news.desckripsi);

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
  const initialData = await getNewsBySlug(slug);

  return (
    <NewsDetailComponent
      slug={slug}
      readOnly={!session}
      initialData={initialData}
    />
  );
}