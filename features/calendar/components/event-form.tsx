"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import type { CalendarEvent, Category } from "../types";

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
  date: z.string().min(1, "Tanggal harus diisi"),
  time: z.string().optional(),
  location: z.string().optional(),
  category: z.string().min(1, "Kategori harus dipilih"),
  description: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

type Props = {
  event?: CalendarEvent;
  readOnly?: boolean;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
};

export const EventForm = ({
  event,
  readOnly,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          title: event.title,
          date: event.date.toISOString().split("T")[0],
          time: event.time || "",
          location: event.location || "",
          category: event.category,
          description: event.description || "",
        }
      : {
          title: "",
          date: new Date().toISOString().split("T")[0],
          time: "",
          location: "",
          category: "",
          description: "",
        },
  });

  const inputClass = readOnly
    ? "input-editable h-10 rounded-lg px-3.5 text-sm opacity-60 pointer-events-none"
    : "input-editable h-10 rounded-lg px-3.5 text-sm";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="field-label" htmlFor="title">
          Judul
        </label>
        <input
          id="title"
          {...register("title")}
          className={inputClass}
          placeholder="Nama kegiatan"
          readOnly={readOnly}
        />
        {errors.title && (
          <p className="text-xs text-danger mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="field-label" htmlFor="date">
          Tanggal
        </label>
        <input
          id="date"
          type="date"
          {...register("date")}
          className={inputClass}
          readOnly={readOnly}
        />
        {errors.date && (
          <p className="text-xs text-danger mt-1">{errors.date.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="field-label" htmlFor="time">
          Waktu (opsional)
        </label>
        <input
          id="time"
          type="time"
          {...register("time")}
          className={inputClass}
          readOnly={readOnly}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="field-label" htmlFor="location">
          Lokasi (opsional)
        </label>
        <input
          id="location"
          {...register("location")}
          className={inputClass}
          placeholder="Ruang atau link"
          readOnly={readOnly}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="field-label" htmlFor="category">
          Kategori
        </label>
        <select
          id="category"
          {...register("category")}
          className={inputClass}
          disabled={readOnly}
        >
          <option value="">Pilih kategori</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-danger mt-1">{errors.category.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="field-label" htmlFor="description">
          Deskripsi (opsional)
        </label>
        <textarea
          id="description"
          {...register("description")}
          className={`${inputClass} min-h-20 resize-y pt-2.5`}
          placeholder="Catatan tambahan"
          readOnly={readOnly}
        />
      </div>

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
          className="self-center text-xs text-danger hover:text-danger/80 transition-colors mt-1 hover:bg-danger/10 w-full py-1.5 rounded-lg"
        >
          Hapus event
        </button>
      )}
    </form>
  );
};
