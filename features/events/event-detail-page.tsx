import { EventDetail } from "./components";

const EventDetailPage = async ({ eventSlug }: { eventSlug: string }) => {
  return <EventDetail slug={eventSlug} />;
};

export default EventDetailPage;
