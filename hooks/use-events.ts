"use client";

import {
  getAllEvents,
  getEventBySlug,
  getEventParticipants,
} from "@/server/data/events";
import { useQuery } from "@tanstack/react-query";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => getAllEvents(),
  });
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
