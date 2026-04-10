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

export const useEventsHome = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["events_home"], // Key spesifik home
    queryFn: () => getAllEvents(),
  });

  useEffect(() => {
    const channel = supabase
      .channel("home_events_channel") // Nama channel unik
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events_home"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participants" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events_home"] });
          queryClient.invalidateQueries({ queryKey: ["participants"] });
        },
      )
      .subscribe((status) => console.log({ event_home: status }));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

export const useEventsPage = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["events_list"], // Key spesifik list page
    queryFn: () => getAllEvents(),
  });

  useEffect(() => {
    const channel = supabase
      .channel("page_events_channel") // Nama channel unik beda dengan home
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events_list"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participants" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events_list"] });
          queryClient.invalidateQueries({ queryKey: ["participants"] });
        },
      )
      .subscribe((status) => console.log({ event_list: status }));

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
