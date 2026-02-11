import CardEvent from "@/components/event/card";
import CardBeritaTerbaru from "@/components/event/card-berita-terbaru";
import AcaraMendatang from "@/components/event/home/acara-mendatang";
import BeritaTerbaru from "@/components/event/home/berita-terbaru";
import ProfileHome from "@/components/event/home/profile";

const EventPage = () => {
  return (
    <div className="my-4 mx-3 relative mb-24">
      <ProfileHome />
      <AcaraMendatang>
        <CardEvent />
      </AcaraMendatang>
      <BeritaTerbaru>
        <CardBeritaTerbaru />
      </BeritaTerbaru>
    </div>
  );
};

export default EventPage;
