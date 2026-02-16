"use client";

import CardEvent from "../card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEvents } from "@/data/acara";
import { SkeletonCardAcara } from "../skeleton-card-acara";
import { formattedDate } from "@/utils/date-format";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const CardAcaras = () => {
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery({
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
              createdBy={data.creator.username || ""}
              description={data.content}
              slug={data.slug}
              image={data.images[0]?.url || ""}
              judul={data.judul}
              lokasi={data.lokasi}
              tanggal={formattedDate(data.date)}
              participant={data.participants.map((p) => ({
                image: p.user.image || "",
                id: p.user.id,
              }))}
              maxCapacity={data.maxCapacity}
              totalParticipant={data.participants.length}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CardAcaras;
