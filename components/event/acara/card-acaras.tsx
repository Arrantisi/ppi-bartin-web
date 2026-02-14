"use client";

import CardEvent from "../card";
import { useQuery } from "@tanstack/react-query";
import { getAllEvents } from "@/data/acara";
import { SkeletonCardAcara } from "../skeleton-card-acara";
import { formattedDate } from "@/utils/date-format";

const CardAcaras = () => {
  const { data: session, isLoading } = useQuery({
    queryKey: ["getAllEvents"],
    queryFn: () => getAllEvents(),
  });

  if (isLoading) {
    return (
      <div className="py-2 space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <SkeletonCardAcara key={idx} />
        ))}
      </div>
    );
  }

  if (!session) {
    return <div>Event tidak ada</div>;
  }

  return (
    <div>
      {session.map((data) => (
        <div key={data.id} className="my-3">
          {data.status === "PUSBLISH" && (
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
          )}
        </div>
      ))}
    </div>
  );
};

export default CardAcaras;
