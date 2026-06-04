"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { cn } from "@/lib/utils";
import { EventListItem } from "./event-list-item";
import { sortEventsByDate } from "../utils/calendar-utils";
import type { CalendarEvent } from "../types";

type Props = {
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  className?: string;
};

export const AgendaView = ({ events, onEditEvent, className }: Props) => {
  const sorted = sortEventsByDate(events);
  const future = sorted.filter((e) => e.date >= new Date());
  const past = sorted.filter((e) => e.date < new Date());

  if (future.length === 0 && past.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-sm text-text-secondary">Belum ada kegiatan</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {future.length > 0 && (
        <div>
          <div className="px-4 py-2">
            <p className="subheadline">Akan Datang</p>
          </div>
          <div className="divide-y divide-border">
            {future.map((event) => (
              <div key={event.id}>
                <div className="px-4 pt-4 pb-1">
                  <p className="font-mono text-xs text-text-disabled">
                    {format(event.date, "EEE, d MMM", { locale: id }).toUpperCase()}
                  </p>
                </div>
                <EventListItem
                  event={event}
                  onEdit={() => onEditEvent(event)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div className="mt-6">
          <div className="px-4 py-2">
            <p className="subheadline">Selesai</p>
          </div>
          <div className="divide-y divide-border opacity-60">
            {past.map((event) => (
              <div key={event.id}>
                <div className="px-4 pt-4 pb-1">
                  <p className="font-mono text-xs text-text-disabled">
                    {format(event.date, "EEE, d MMM", { locale: id }).toUpperCase()}
                  </p>
                </div>
                <EventListItem
                  event={event}
                  onEdit={() => onEditEvent(event)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
