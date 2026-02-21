"use client";

import { getAllEvents } from "@/data/events";
import { formattedDate } from "@/utils/date-format";
import CardEvent from "../card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SkeletonCardAcara } from "../skeleton-card-acara";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const RenderAcara = () => {
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["render_acara_terbaru"],
    queryFn: () => getAllEvents(),
  });

  useEffect(() => {
    const channel = supabase
      .channel("render_acara_terbaru")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["render_acara_terbaru"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participants" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["render_acara_terbaru"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "images" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["render_acara_terbaru"] });
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
    return <SkeletonCardAcara />;
  }

  const filterEvent = events?.filter(
    (publish) => publish.status === "PUSBLISH",
  );
  if (!filterEvent || filterEvent.length === 0) {
    return <div>event terbaru tidak ada</div>;
  }

  const data = filterEvent[0];

  return (
    <CardEvent
      maxCapacity={data.maxCapacity || 0}
      id={data.id}
      createdBy={data.creator.username || ""}
      description={data.content || ""}
      slug={data.slug}
      image={data.images[0]?.url}
      judul={data.judul}
      lokasi={data.lokasi || ""}
      tanggal={formattedDate(data.date || new Date())}
      participant={
        data.participants.map((p) => ({
          image: p.user.image || "",
          id: p.user.id,
        })) || []
      }
      totalParticipant={data.participants.length}
    />
  );
};
