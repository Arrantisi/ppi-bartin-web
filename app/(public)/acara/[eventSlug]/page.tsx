import { EventDetail } from "@/features/events/components";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { safeDb } from "@/lib/db/safe";
import { getEventBySlug } from "@/server/data/events";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { absoluteUrl, defaultOgImage } from "@/lib/og";
import { imageUrl } from "@/utils/image-url";
import { toMetaDescription } from "@/utils/meta-description";

// Sengaja TIDAK ada generateStaticParams / revalidate di sini.
//
// Body halaman ini memanggil headers() untuk membaca session, sehingga
// route wajib dirender dinamis. Kalau generateStaticParams ditambahkan,
// Next menandai route sebagai SSG, prerender dibatalkan karena
// DYNAMIC_SERVER_USAGE, tidak ada HTML yang dihasilkan, dan setiap
// request berikutnya ending 500.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = await safeDb(
    () => prisma.events.findUnique({ where: { slug: eventSlug } }),
    null,
    "acara/[eventSlug] metadata",
  );

  // Query gagal ≠ event tidak ada. Jangan tampilkan "Tidak Ditemukan" kalau
  // masalahnya cuma database tidak terjangkau saat build.
  if (!event) {
    return { title: "Acara", description: "Informasi acara PPI Bartın" };
  }

  const description = toMetaDescription(event.deskripsi);

  const ogImage = event.fileKey
    ? { url: imageUrl(event.fileKey), width: 1200, height: 630, alt: event.judul }
    : defaultOgImage;

  return {
    title: event.judul,
    description,
    openGraph: {
      title: event.judul,
      description,
      url: absoluteUrl(`/acara/${eventSlug}`),
      type: "article",
      publishedTime: event.createdAt.toISOString(),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: event.judul,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function PublicEventDetailPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const initialData = await getEventBySlug(eventSlug);

  return (
    <EventDetail
      slug={eventSlug}
      readOnly={!session}
      initialData={initialData}
    />
  );
}