"use client";

import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EventListItem } from "./event-list-item";
import {
  formatDateHeader,
  sortEventsByDate,
  getEventsForDate,
} from "@/utils/calendar-utils";
import type { CalendarEvent } from "@/types/calendar";

type Props = {
  selectedDate: Date;
  events: CalendarEvent[];
  onAddEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  className?: string;
};

export const EventList = ({
  selectedDate,
  events,
  onAddEvent,
  onEditEvent,
  className,
}: Props) => {
  const todayEvents = sortEventsByDate(getEventsForDate(events, selectedDate));

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="font-mono text-xs leading-[1.4] text-text-secondary tracking-normal">
          {formatDateHeader(selectedDate)}
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onAddEvent}
          className="size-8 shrink-0"
          aria-label="Tambah kegiatan"
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>

      {todayEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <p className="text-sm text-text-secondary">Tidak ada kegiatan</p>
          <p className="text-xs text-text-disabled mt-1">
            Pilih tanggal lain atau tambah kegiatan baru
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {todayEvents.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              onEdit={() => onEditEvent(event)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
