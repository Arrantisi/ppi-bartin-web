import CardBeritaTerbaru from "@/components/event/card-berita-terbaru";
import AcaraMendatang from "@/components/event/home/acara-mendatang";
import BeritaTerbaru from "@/components/event/home/berita-terbaru";
import ProfileHome from "@/components/event/home/profile";
import { RenderAcara } from "@/components/event/home/render-acara";

const EventPage = () => {
  return (
    <div>
      <ProfileHome />
      <AcaraMendatang>
        <RenderAcara />
      </AcaraMendatang>
      <BeritaTerbaru>
        <CardBeritaTerbaru />
      </BeritaTerbaru>
    </div>
  );
};

export default EventPage;
