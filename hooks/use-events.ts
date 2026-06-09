"use client";

import {
  getAllEvents,
  getEventBySlug,
  getEventParticipants,
} from "@/server/data/events";
import type { TgetEventBySlug } from "@/server/data/events";
import { useQuery } from "@tanstack/react-query";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => getAllEvents(),
  });
};

// Aliases — share same query key so React Query deduplicates fetches
export const useEventsHome = useEvents;
export const useEventsPage = useEvents;

export const useEventBySlug = ({
  slug,
  initialData,
}: {
  slug: string;
  initialData?: TgetEventBySlug;
}) => {
  return useQuery({
    queryKey: ["events_by_slug", slug],
    queryFn: () => getEventBySlug(slug),
    enabled: !!slug && slug !== "undefined",
    initialData,
  });
};

export const useEventParticipants = ({ eventId }: { eventId: string }) => {
  return useQuery({
    queryKey: ["participants", eventId],
    queryFn: () => getEventParticipants(eventId),
    enabled: !!eventId && eventId !== "undefined",
  });
};
