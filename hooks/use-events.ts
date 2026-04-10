"use client";

import { supabase } from "@/lib/supabase";
import {
  getAllEvents,
  getEventBySlug,
  getEventParticipants,
} from "@/server/data/events";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useEvents = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["events"],
    queryFn: () => getAllEvents(),
  });

  useEffect(() => {
    // Nama channel unik gabungan agar tidak bentrok antar instance
    const channel = supabase
      .channel("events_global_realtime")
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
          // Invalidate list events karena biasanya jumlah peserta ditampilkan di sana
          queryClient.invalidateQueries({ queryKey: ["events"] });
        },
      )
      .subscribe((status) => {
        console.log("events", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};
export const useEventBySlug = ({ slug }: { slug: string }) => {
  return useQuery({
    queryKey: ["events", slug],
    queryFn: () => getEventBySlug(slug),
    enabled: !!slug && slug !== "undefined",
  });
};

export const useEventParticipants = ({ eventId }: { eventId: string }) => {
  return useQuery({
    queryKey: ["participants", eventId],
    queryFn: () => getEventParticipants(eventId),
    enabled: !!eventId && eventId !== "undefined",
  });
};
