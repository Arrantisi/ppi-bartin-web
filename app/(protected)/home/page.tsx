import AcaraMendatang from "@/components/event/home/acara-mendatang";
import BeritaTerbaru from "@/components/event/home/berita-terbaru";
import ProfileHome from "@/components/event/home/profile";
import { HomeLayoutComponent } from "@/components/layouts/home-layout";

const EventPage = () => {
  return (
    <HomeLayoutComponent>
      <ProfileHome />
      <AcaraMendatang />

      <BeritaTerbaru />
    </HomeLayoutComponent>
  );
};

export default EventPage;
