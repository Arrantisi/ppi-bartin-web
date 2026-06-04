"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CategoryDot } from "./category-dot";
import type { CalendarEvent } from "../types";

type Props = {
  event: CalendarEvent;
  onEdit: () => void;
};

export const EventListItem = ({ event, onEdit }: Props) => {
  const time = event.time || format(event.date, "HH:mm");
  const isParticipant = event.source === "participant";

  return (
    <button
      type="button"
      onClick={onEdit}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
        "hover:bg-surface-hover",
        "min-h-11",
        isParticipant && "cursor-default opacity-70 hover:bg-transparent",
      )}
    >
      <CategoryDot category={event.category} />
      <span className="mt-0.5 shrink-0 font-mono text-xs leading-[1.4] text-text-secondary w-10 tabular-nums">
        {time}
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
