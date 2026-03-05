"use client";

import CardEvent from "../../cards/card-event";
import { useQueryClient } from "@tanstack/react-query";
import { SkeletonCardAcara } from "../../skeletons/card-event-skeleton";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useEvents } from "@/hooks/use-events";

const CardAcaras = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useEvents();

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
        console.log("card-events", status);
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
    <div className="mt-3 gap-6 min-h-screen w-full relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-center">
      {data.map((data) => (
        <div key={data.id} className="flex justify-center z-10">
          <CardEvent {...data} />
        </div>
      ))}
    </div>
  );
};

export default CardAcaras;
