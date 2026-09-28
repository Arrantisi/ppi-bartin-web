import { EventDetail } from "@/features/events/components";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { safeDb, safeStaticParams } from "@/lib/db/safe";
import { getEventBySlug } from "@/server/data/events";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { absoluteUrl, defaultOgImage } from "@/lib/og";
import { imageUrl } from "@/utils/image-url";
import { toMetaDescription } from "@/utils/meta-description";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return safeStaticParams(
    () =>
      prisma.events.findMany({
        select: { slug: true },
        where: { environment: "production" },
      }),
    "acara/[eventSlug]",
  );
}

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