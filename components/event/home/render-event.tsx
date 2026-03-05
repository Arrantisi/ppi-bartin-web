"use client";

import { useEffect } from "react";
import CardEvent from "../../cards/card-event";
import { SkeletonCardAcara } from "../../skeletons/card-event-skeleton";
import { useEvents } from "@/hooks/use-events";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export const RenderAcara = () => {
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useEvents();

  useEffect(() => {
    const channel = supabase
      .channel("events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participants" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events"] });
        },
      )
      .subscribe((status) => {
        console.log("home-event", status);
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
