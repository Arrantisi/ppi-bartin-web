"use client";

import { DayPicker, type DayButtonProps } from "react-day-picker";
import { id } from "date-fns/locale/id";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { hasEventOnDate } from "@/utils/calendar-utils";
import type { CalendarEvent } from "@/types/calendar";

type Props = {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  events: CalendarEvent[];
};

function DotDayButton({ day, modifiers, ...buttonProps }: DayButtonProps) {
  return (
    <button {...buttonProps} type="button">
      <span className="relative inline-flex items-center justify-center">
        <span>{day.date.getDate()}</span>
        {modifiers.hasEvent && (
          <span className="absolute left-1/2 -translate-x-1/2 top-full mb-1 block w-1.25 h-1.25 rounded-full bg-accent" />
        )}
      </span>
    </button>
  );
}

export const CalendarMini = ({ selectedDate, onSelect, events }: Props) => {
  return (
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={(date) => date && onSelect(date)}
      locale={id}
      showOutsideDays={false}
      className="bg-surface border border-border rounded-[10px] p-3"
      classNames={{
        root: "w-full",
        months: "flex flex-col",
        month: "flex flex-col w-full",
        nav: "flex items-center justify-between mb-2",
        button_previous:
          "flex items-center justify-center size-8 p-0 text-text-disabled hover:text-text-primary active:text-text-primary transition-colors",
        button_next:
          "flex items-center justify-center size-8 p-0 text-text-disabled hover:text-text-primary active:text-text-primary transition-colors",
        month_caption: "flex items-center justify-center",
        caption_label:
          "text-sm font-semibold text-text-primary tracking-[-0.01em] select-none",
        month_grid: "",
        weekdays: "grid grid-cols-7",
        weekday:
          "text-center text-xs uppercase tracking-wider text-text-disabled py-1 select-none",
        week: "grid grid-cols-7",
        day: "flex items-center justify-center h-9 text-center select-none data-selected:bg-text-primary/15 data-selected:rounded-xl",
        day_button:
          "h-9 w-full text-sm text-text-secondary rounded-xl hover:bg-surface-hover active:bg-surface-active transition-colors data-selected:text-text-primary",
        today: "ring-1 ring-text-primary/30 rounded-xl",
        outside: "text-text-disabled opacity-40",
        disabled: "text-text-disabled opacity-40",
        hidden: "invisible",
      }}
      formatters={{
        formatCaption: (date) =>
          date.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          }),
      }}
      components={{
        DayButton: DotDayButton,
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <IconChevronLeft className="size-4" />;
          }
          return <IconChevronRight className="size-4" />;
        },
      }}
      modifiers={{
        hasEvent: (date) => hasEventOnDate(events, date),
      }}
    />
  );
};
