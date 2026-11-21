import { EventDetail } from "./components";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

const EventDetailPage = async ({ eventSlug }: { eventSlug: string }) => {
  return (
    <HomeLayoutComponent>
      <EventDetail slug={eventSlug} />
    </HomeLayoutComponent>
  );
};

export default EventDetailPage;
