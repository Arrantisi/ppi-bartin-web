"use client";

import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { CalendarMini } from "./calendar-mini";
import { EventList } from "./event-list";
import { EventDialog } from "./event-dialog";
import { useCalendar } from "../hooks/use-calendar";
import {
  createEntry,
  updateEntry,
  deleteEntry,
} from "@/server/actions/calendar-entry";
import type { CalendarEvent, Category } from "../types";

type Props = {
  events?: CalendarEvent[];
  className?: string;
};

export const CalendarView = ({ events = [], className }: Props) => {
  const queryClient = useQueryClient();
  const { state, selectDate, openAddDialog, openEditDialog, closeDialog } =
    useCalendar(events);

  const currentEvents = useMemo(
    () => (state.view === "daily" ? state.events : state.events),
    [state.events, state.view],
  );

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["profileUser"] });
  }, [queryClient]);

  const handleSave = useCallback(
    async (data: {
      title: string;
      date: Date;
      time?: string;
      location?: string;
      category: Category;
      description?: string;
    }) => {
      if (state.dialog.mode === "add") {
        await createEntry({
          title: data.title,
          date: data.date,
          time: data.time,
          location: data.location,
          category: data.category,
          description: data.description,
        });
      } else if (state.dialog.event && state.dialog.event.source === "entry") {
        await updateEntry(state.dialog.event.id, {
          title: data.title,
          date: data.date,
          time: data.time,
          location: data.location,
          category: data.category,
          description: data.description,
        });
      }
      invalidate();
      closeDialog();
    },
    [state.dialog, invalidate, closeDialog],
  );

  const handleDelete = useCallback(async () => {
    if (state.dialog.event && state.dialog.event.source === "entry") {
      await deleteEntry(state.dialog.event.id);
      invalidate();
    }
    closeDialog();
  }, [state.dialog.event, invalidate, closeDialog]);

  const isParticipant = state.dialog.event?.source === "participant";

  return (
    <div className={cn("flex flex-col md:flex-row md:gap-6", className)}>
      <div className="md:basis-70 md:shrink-0 md:sticky md:top-4 md:self-start">
        <CalendarMini
          selectedDate={state.selectedDate}
          onSelect={selectDate}
          events={currentEvents}
        />
      </div>

      <div className="flex-1 min-w-0 mt-4 md:mt-0">
        <EventList
          selectedDate={state.selectedDate}
          events={currentEvents}
          onEditEvent={openEditDialog}
          onAddEvent={openAddDialog}
          className="border border-border rounded-lg bg-card"
        />
      </div>

      <EventDialog
        open={state.dialog.open}
        mode={state.dialog.mode}
        event={state.dialog.event}
        onSave={handleSave}
        onDelete={
          state.dialog.mode === "edit" && !isParticipant
            ? handleDelete
            : undefined
        }
        onClose={closeDialog}
      />
    </div>
  );
};
