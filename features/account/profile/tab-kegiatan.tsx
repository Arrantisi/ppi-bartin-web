"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TgetProfileUser } from "@/server/data/users";
import { CalendarMini } from "@/features/calendar/components/calendar-mini";
import { SplitEventList } from "@/features/calendar/components/split-event-list";
import { EventDialog } from "@/features/calendar/components/event-dialog";
import { useCalendar } from "@/hooks/use-calendar";
import {
  createEntry,
  updateEntry,
  deleteEntry,
} from "@/server/actions/calendar-entry";
import type { CalendarEvent, Category } from "@/types/calendar";

type Props = {
  user: NonNullable<TgetProfileUser>;
};

export const TabKegiatan = ({ user }: Props) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { state, selectDate, setView, openAddDialog, openEditDialog, closeDialog } =
    useCalendar();

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["profileUser"] });
  }, [queryClient]);

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

  const handleSave = useCallback(
    async (data: {
      title: string;
      date: Date;
      time?: string;
      location?: string;
      category: Category;
      description?: string;
    }) => {
      setIsSubmitting(true);
      try {
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
      } finally {
        setIsSubmitting(false);
      }
    },
    [state.dialog, invalidate, closeDialog],
  );

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      if (state.dialog.event && state.dialog.event.source === "entry") {
        await deleteEntry(state.dialog.event.id);
        invalidate();
      }
      closeDialog();
    } finally {
      setIsDeleting(false);
    }
  }, [state.dialog.event, invalidate, closeDialog]);

  const isParticipant = state.dialog.event?.source === "participant";

  return (
    <div className="mt-4 flex flex-col md:flex-row md:gap-6">
      <div className="md:basis-70 md:shrink-0 md:sticky md:top-4 md:self-start">
        <CalendarMini
          selectedDate={state.selectedDate}
          onSelect={selectDate}
          events={[...participantEvents, ...personalEntries]}
        />
      </div>

      <div className="flex-1 min-w-0 mt-4 md:mt-0">
        <SplitEventList
          selectedDate={state.selectedDate}
          view={state.view}
          onViewChange={setView}
          personalEntries={personalEntries}
          participantEvents={participantEvents}
          onAddEvent={openAddDialog}
          onEditEvent={openEditDialog}
          className="border border-border rounded-lg bg-card"
        />
      </div>

      <EventDialog
        open={state.dialog.open}
        mode={state.dialog.mode}
        event={state.dialog.event}
        defaultDate={state.dialog.mode === "add" ? state.selectedDate : undefined}
        onSave={handleSave}
        onDelete={
          state.dialog.mode === "edit" && !isParticipant
            ? handleDelete
            : undefined
        }
        onClose={closeDialog}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
      />
    </div>
  );
};
