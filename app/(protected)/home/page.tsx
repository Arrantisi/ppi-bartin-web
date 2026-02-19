import CardBeritaTerbaru from "@/components/event/card-berita-terbaru";
import AcaraMendatang from "@/components/event/home/acara-mendatang";
import BeritaTerbaru from "@/components/event/home/berita-terbaru";
import ProfileHome from "@/components/event/home/profile";
import { RenderAcara } from "@/components/event/home/render-acara";
import { HomeLayoutComponent } from "@/components/layouts/home-layout";

const EventPage = () => {
  return (
    <HomeLayoutComponent>
      <ProfileHome />
      <AcaraMendatang>
        <RenderAcara />
      </AcaraMendatang>
      <BeritaTerbaru>
        <CardBeritaTerbaru />
      </BeritaTerbaru>
    </HomeLayoutComponent>
  );
};

export default EventPage;
