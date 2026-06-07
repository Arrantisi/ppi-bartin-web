"use client";

import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { cn } from "@/lib/utils";
import { CategoryDot } from "./category-dot";
import {
  formatDateHeader,
  sortEventsByDate,
  getEventsForDate,
  groupEventsByDate,
} from "@/utils/calendar-utils";
import type { CalendarEvent, ViewType } from "@/types/calendar";

type Props = {
  selectedDate: Date;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  participantEvents: CalendarEvent[];
  className?: string;
};

function ParticipantEventRow({ event }: { event: CalendarEvent }) {
  const time = event.time || format(event.date, "HH:mm");
  return (
    <Link
      href={`/home/acara/${event.slug}`}
      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover active:bg-surface-active min-h-11 opacity-70"
    >
      <span className="flex items-center gap-3 mt-0.5">
        <CategoryDot category={event.category} />
        <span className="shrink-0 font-mono text-xs leading-[1.4] text-text-secondary w-10 tabular-nums">
          {time}
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">
          {event.title}
        </p>
      </div>
    </Link>
  );
}

function ParticipantDaily({
  events,
}: {
  events: CalendarEvent[];
}) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <p className="text-sm text-text-secondary">
          Belum terdaftar di event
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {events.map((event) => (
        <ParticipantEventRow key={event.id} event={event} />
      ))}
    </div>
  );
}

function ParticipantAgenda({
  events,
}: {
  events: CalendarEvent[];
}) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <p className="text-sm text-text-secondary">
          Belum terdaftar di event
        </p>
      </div>
    );
  }

  const grouped = groupEventsByDate(events);
  const sorted = [...grouped.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div>
      {sorted.map(([dateKey, dateEvents]) => (
        <div key={dateKey}>
          <div className="px-4 py-2 border-b border-border">
            <p className="font-mono text-xs text-text-disabled">
              {format(new Date(dateKey + "T00:00:00"), "d MMMM yyyy", {
                locale: id,
              })}
            </p>
          </div>
          <div className="divide-y divide-border">
            {sortEventsByDate(dateEvents).map((event) => (
              <ParticipantEventRow key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const SplitEventList = ({
  selectedDate,
  view,
  onViewChange,
  participantEvents,
  className,
}: Props) => {
  const participantDaily = sortEventsByDate(
    getEventsForDate(participantEvents, selectedDate),
  );

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="font-mono text-xs leading-[1.4] text-text-secondary tracking-normal">
          {formatDateHeader(selectedDate)}
        </p>
        <div className="flex rounded-lg bg-surface-hover p-0.5">
          <button
            type="button"
            onClick={() => onViewChange("daily")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
              view === "daily"
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-disabled hover:text-text-secondary",
            )}
          >
            Harian
          </button>
          <button
            type="button"
            onClick={() => onViewChange("agenda")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
              view === "agenda"
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-disabled hover:text-text-secondary",
            )}
          >
            Agenda
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-2">
        <h4 className="text-sm font-semibold text-text-primary">
          Event Terdaftar
        </h4>
      </div>

      {view === "daily" ? (
        <ParticipantDaily events={participantDaily} />
      ) : (
        <ParticipantAgenda events={participantEvents} />
      )}
    </div>
  );
};
