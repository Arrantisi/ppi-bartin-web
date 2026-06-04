"use client";

import type { TgetProfileUser } from "@/server/data/users";
import { CalendarView } from "@/features/calendar/components/calendar-view";
import type { CalendarEvent, Category } from "@/types/calendar";

type Props = {
  user: NonNullable<TgetProfileUser>;
};

export const TabKegiatan = ({ user }: Props) => {
  const participantEvents: CalendarEvent[] = (user.participants || []).map(
    (p) => ({
      id: p.id,
      title: p.event.judul,
      date: new Date(p.event.date),
      category: "beasiswa" as Category,
      source: "participant" as const,
    }),
  );

  const personalEntries: CalendarEvent[] = (user.calendarEntries || []).map(
    (e) => ({
      id: e.id,
      title: e.title,
      date: new Date(e.date),
      time: e.time ?? undefined,
      location: e.location ?? undefined,
      category: e.category as Category,
      description: e.description ?? undefined,
      source: "entry" as const,
    }),
  );

  const events = [...participantEvents, ...personalEntries];

  return (
    <div className="mt-4">
      <CalendarView events={events} />
    </div>
  );
};
