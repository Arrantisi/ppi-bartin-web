import { EventDetail } from "@/features/events/components";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import type { Metadata } from "next";

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

  return {
    title: event.judul,
    description: event.deskripsi.length > 160 ? event.deskripsi.slice(0, 157) + "..." : event.deskripsi,
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