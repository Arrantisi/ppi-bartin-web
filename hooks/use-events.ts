"use client";

import {
  getAllEvents,
  getEventBySlug,
  getEventParticipants,
} from "@/server/data/events";
import { useQuery } from "@tanstack/react-query";

export const useEvents = () => {
  const query = useQuery({
    queryKey: ["events"],
    queryFn: () => getAllEvents(),
  });

  return query;
};

export const useEventsHome = () => {
  const query = useQuery({
    queryKey: ["events_home"], // Key spesifik home
    queryFn: () => getAllEvents(),
  });

  return query;
};

export const useEventsPage = () => {
  const query = useQuery({
    queryKey: ["events_list"], // Key spesifik list page
    queryFn: () => getAllEvents(),
  });

  return query;
};

export const useEventBySlug = ({ slug }: { slug: string }) => {
  return useQuery({
    queryKey: ["events_by_slug", slug],
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
