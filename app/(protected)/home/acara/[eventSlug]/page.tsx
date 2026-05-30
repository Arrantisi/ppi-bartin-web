import EventDetailPage from "@/features/events/event-detail-page";

const DetailEventPage = async ({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) => {
  const { eventSlug } = await params;

  return <EventDetailPage eventSlug={eventSlug} />;
};

export default DetailEventPage;
