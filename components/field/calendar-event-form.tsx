"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { IconLoader } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import type { CalendarEvent, Category } from "@/types/calendar";

const categories: { value: Category; label: string }[] = [
  { value: "beasiswa", label: "Beasiswa" },
  { value: "akademik", label: "Akademik" },
  { value: "sosial", label: "Sosial" },
  { value: "olahraga", label: "Olahraga" },
  { value: "pengumuman", label: "Pengumuman" },
  { value: "kaderisasi", label: "Kaderisasi" },
];

const eventSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  time: z.string(),
  location: z.string(),
  category: z.string().min(1, "Kategori harus dipilih"),
  description: z.string(),
});

type EventFormData = z.infer<typeof eventSchema>;

type Props = {
  event?: CalendarEvent;
  readOnly?: boolean;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
};

export const EventForm = ({
  event,
  readOnly,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting,
  isDeleting,
}: Props) => {
  const form = useForm({
    defaultValues: {
      title: event?.title || "",
      time: event?.time || "",
      location: event?.location || "",
      category: event?.category || "",
      description: event?.description || "",
    },
    validators: { onSubmit: eventSchema },
    onSubmit: ({ value }) => onSubmit(value as EventFormData),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <form.Field name="title">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid || undefined}>
              <FieldLabel htmlFor={field.name}>Judul</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Nama kegiatan"
                readOnly={readOnly}
                aria-invalid={isInvalid || undefined}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="time">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>
              Waktu (opsional)
            </FieldLabel>
            <Input
              id={field.name}
              type="time"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              readOnly={readOnly}
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="location">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>
              Lokasi (opsional)
            </FieldLabel>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ruang atau link"
              readOnly={readOnly}
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="category">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid || undefined}>
              <FieldLabel htmlFor={field.name}>Kategori</FieldLabel>
              <Select
                name={field.name}
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
                disabled={readOnly}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={isInvalid || undefined}
                >
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>
              Deskripsi (opsional)
            </FieldLabel>
            <Textarea
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Catatan tambahan"
              readOnly={readOnly}
              className="min-h-20"
            />
          </Field>
        )}
      </form.Field>

      {!readOnly && (
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <IconLoader className="size-4 animate-spin" />
            ) : null}
            {isSubmitting ? "Menyimpan..." : event ? "Simpan" : "Tambah"}
          </Button>
        </div>
      )}

      {readOnly && (
        <div className="flex pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
          >
            Tutup
          </Button>
        </div>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center justify-center gap-2 self-center text-xs text-danger hover:text-danger/80 active:text-danger/60 transition-colors mt-1 hover:bg-danger/10 active:bg-danger/15 w-full py-1.5 rounded-lg disabled:opacity-50"
        >
          {isDeleting ? (
            <IconLoader className="size-3.5 animate-spin" />
          ) : null}
          {isDeleting ? "Menghapus..." : "Hapus event"}
        </button>
      )}
    </form>
  );
};
