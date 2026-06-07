"use client";

import type { TgetProfileUser } from "@/server/data/users";
import { CalendarMini } from "@/features/calendar/components/calendar-mini";
import { SplitEventList } from "@/features/calendar/components/split-event-list";
import { useCalendar } from "@/hooks/use-calendar";
import type { CalendarEvent, Category } from "@/types/calendar";

type Props = {
  user: NonNullable<TgetProfileUser>;
};

export const TabKegiatan = ({ user }: Props) => {
  const { state, selectDate, setView } = useCalendar();

  const participantEvents: CalendarEvent[] = (user.participants || []).map(
    (p) => ({
      id: p.id,
      title: p.event.judul,
      date: new Date(p.event.date),
      slug: p.event.slug,
      category: "beasiswa" as Category,
      source: "participant" as const,
    }),
  );

  return (
    <div className="mt-4 flex flex-col md:flex-row md:gap-6">
      <div className="md:basis-70 md:shrink-0 md:sticky md:top-4 md:self-start">
        <CalendarMini
          selectedDate={state.selectedDate}
          onSelect={selectDate}
          events={participantEvents}
        />
      </div>

      <div className="flex-1 min-w-0 mt-4 md:mt-0">
        <SplitEventList
          selectedDate={state.selectedDate}
          view={state.view}
          onViewChange={setView}
          participantEvents={participantEvents}
          className="border border-border rounded-lg bg-card"
        />
      </div>
    </div>
  );
};
