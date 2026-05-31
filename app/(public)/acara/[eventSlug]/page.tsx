import { EventDetail } from "@/features/events/components";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function PublicEventDetailPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  return <EventDetail slug={eventSlug} readOnly={!session} />;
}