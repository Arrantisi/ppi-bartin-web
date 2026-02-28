"use client";

import CardEvent from "../card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEvents } from "@/server/data/events";
import { SkeletonCardAcara } from "../../skeletons/card-event-skeleton";
import { formattedDate } from "@/utils/date-format";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { imageUrl } from "@/utils/image-url";

const CardAcaras = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["getAllEvents"],
    queryFn: () => getAllEvents(),
  });

  useEffect(() => {
    const channel = supabase
      .channel("getAllEvents")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getAllEvents"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participants" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getAllEvents"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "images" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getAllEvents"] });
        },
      )
      .subscribe((status) => {
        console.log(status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="py-2 space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <SkeletonCardAcara key={idx} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div>Event tidak ada</div>;
  }

  return (
    <div>
      {data.map((data) => (
        <div key={data.id} className="my-3">
          <CardEvent
            id={data.id}
            createdBy={data.creator.username || ""}
            description={data.deskripsi || ""}
            slug={data.slug}
            image={imageUrl(data.fileKey)}
            judul={data.judul}
            lokasi={data.lokasi || ""}
            tanggal={formattedDate(data.date || new Date())}
            participant={data.participants.map((p) => ({
              image: p.user.image || "",
              id: p.user.id,
            }))}
            maxCapacity={data.maxCapacity || 0}
            totalParticipant={data.participants.length}
          />
        </div>
      ))}
    </div>
  );
};

export default CardAcaras;
