"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "./event-form";
import type { CalendarEvent, Category } from "@/types/calendar";

type Props = {
  open: boolean;
  mode: "add" | "edit";
  event?: CalendarEvent;
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
              date: new Date(data.date),
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
