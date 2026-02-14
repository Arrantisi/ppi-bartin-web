import { EventDetail } from "@/components/event/event-detail";

const DetailEventPage = async ({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) => {
  const { eventSlug } = await params;

  console.log(eventSlug);

  return (
    <div>
      <EventDetail slug={eventSlug} />
    </div>
  );
};

export default DetailEventPage;
