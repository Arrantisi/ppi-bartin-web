"use client";

import { format } from "date-fns";
import { CategoryDot } from "./category-dot";
import type { CalendarEvent } from "@/types/calendar";

type Props = {
  event: CalendarEvent;
  onEdit: () => void;
};

export const EventListItem = ({ event, onEdit }: Props) => {
  const time = event.time || format(event.date, "HH:mm");

  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover active:bg-surface-active min-h-11"
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
        {event.location && (
          <p className="truncate text-xs text-text-disabled mt-0.5">
            {event.location}
          </p>
        )}
      </div>
    </button>
  );
};
