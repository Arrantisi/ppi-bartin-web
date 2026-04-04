"use client";

import { useEffect } from "react";

import { useEvents } from "@/hooks/use-events";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { SkeletonCardAcara } from "@/components/skeletons/card-event-skeleton";
import CardEvent from "@/components/cards/card-event";
import Link from "next/link";

export const RenderAcara = () => {
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
        console.log("home-event", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return <SkeletonCardAcara />;
  }

  if (!data || data.length === 0) {
    return <div>Event tidak ada</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="block md:hidden">
        {data.slice(0, 1).map((event) => (
          <Link href={`/home/events/${event.slug}`} key={event.id}>
            <CardEvent {...event} />
          </Link>
        ))}
      </div>
      <div className="hidden xl:block">
        {data.slice(0, 3).map((event) => (
          <Link href={`/home/events/${event.slug}`} key={event.id}>
            <CardEvent {...event} />
          </Link>
        ))}
      </div>
    </div>
  );
};
