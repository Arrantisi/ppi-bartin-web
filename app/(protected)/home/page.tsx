import { HomeContent } from "@/components/event/home/content";
import ProfileHome from "@/components/event/home/header";
import { HomeLayoutComponent } from "@/components/layouts/home-layout";

const EventPage = () => {
  return (
    <HomeLayoutComponent>
      <ProfileHome />
      <HomeContent />
    </HomeLayoutComponent>
  );
};

export default EventPage;
