import CardEvent from "@/components/event/card";
import CardBeritaTerbaru from "@/components/event/card-berita-terbaru";
import AcaraMendatang from "@/components/event/home/acara-mendatang";
import BeritaTerbaru from "@/components/event/home/berita-terbaru";
import ProfileHome from "@/components/event/home/profile";
import { SkeletonCardAcara } from "@/components/event/skeleton-card-acara";
import { getAllEvents } from "@/data/acara";
import { formattedDate } from "@/utils/date-format";
import { Suspense } from "react";

const EventPage = () => {
  return (
    <div>
      <ProfileHome />
      <AcaraMendatang>
        <Suspense fallback={<SkeletonCardAcara />}>
          <RenderAcara />
        </Suspense>
      </AcaraMendatang>
      <BeritaTerbaru>
        <CardBeritaTerbaru />
      </BeritaTerbaru>
    </div>
  );
};

export default EventPage;

const RenderAcara = async () => {
  const fetch = await getAllEvents();

  const data = fetch[0];

  return (
    <CardEvent
      id={data.id}
      createdBy={data.creator.name || ""}
      description={data.content}
      slug={data.slug}
      image={data.images[0].url || "/prestasi-news.jpeg"}
      judul={data.judul}
      lokasi={data.lokasi}
      tanggal={formattedDate(data.date)}
      totalParticipant={"50"}
    />
  );
};
