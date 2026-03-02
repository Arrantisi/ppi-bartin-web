"use client";

import { getAllEvents } from "@/server/data/events";
import CardEvent from "../card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SkeletonCardAcara } from "../../skeletons/card-event-skeleton";
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

  if (!events || events.length === 0) {
    return <div>Event tidak ada</div>;
  }

  const data1 = events[0];
  const data2 = events[1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CardEvent {...data1} />
      <div className="hidden md:block">
        <CardEvent {...data2} />
      </div>
    </div>
  );
};
