import { EventDetail } from "@/features/events/components";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { absoluteUrl, defaultOgImage } from "@/lib/og";
import { imageUrl } from "@/utils/image-url";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const allEvents = await prisma.events.findMany({
    select: { slug: true },
    where: { environment: "production" },
  });
  return allEvents.map((item) => ({ eventSlug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = await prisma.events.findUnique({ where: { slug: eventSlug } });

  if (!event) {
    return { title: "Acara Tidak Ditemukan", description: "Acara tidak ditemukan" };
  }

  const description = event.deskripsi.length > 160 ? event.deskripsi.slice(0, 157) + "..." : event.deskripsi;

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

  return <EventDetail slug={eventSlug} readOnly={!session} />;
}