"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "@/components/field/calendar-event-form";
import type { CalendarEvent, Category } from "@/types/calendar";

type Props = {
  open: boolean;
  mode: "add" | "edit";
  event?: CalendarEvent;
  defaultDate?: Date;
  onSave: (data: {
    title: string;
    date: Date;
    time?: string;
    location?: string;
    category: Category;
    description?: string;
  }) => void;
  onDelete?: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
};

export const EventDialog = ({
  open,
  mode,
  event,
  defaultDate,
  onSave,
  onDelete,
  onClose,
  isSubmitting,
}: Props) => {
  const isReadOnly = event?.source === "participant";

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isReadOnly
              ? "Detail Kegiatan"
              : mode === "add"
                ? "Tambah Event"
                : "Edit Event"}
          </DialogTitle>
        </DialogHeader>

        <EventForm
          event={event}
          readOnly={isReadOnly}
          onSubmit={(data) =>
            onSave({
              title: data.title,
              date: mode === "edit" && event ? event.date : (defaultDate || new Date()),
              time: data.time || undefined,
              location: data.location || undefined,
              category: data.category as Category,
              description: data.description || undefined,
            })
          }
          onCancel={onClose}
          onDelete={mode === "edit" && !isReadOnly ? onDelete : undefined}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
