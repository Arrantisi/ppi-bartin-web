import * as z from "zod";

const eventJudulSchema = z
  .string()
  .min(8, "Nama agenda minimal 8 karakter")
  .max(100, "Judul terlalu panjang");

const eventLokasiSchema = z.string().min(1, "Lokasi acara wajib diisi");

const eventDateSchema = z.date({
  error: "Silakan tentukan tanggal acara",
});

const eventDeskripsiSchema = z
  .string()
  .min(8, "Deskripsi acara minimal 8 karakter");

const eventMaxCapacitySchema = z
  .number({ error: "Kapasitas harus berupa angka" })
  .int("Harus berupa bilangan bulat")
  .min(1, "Kapasitas minimal 1 orang");

const eventBaseSchema = z.object({
  judul: eventJudulSchema,
  lokasi: eventLokasiSchema,
  date: eventDateSchema,
  deskripsi: eventDeskripsiSchema,
  maxCapacity: eventMaxCapacitySchema,
});

const environmentSchema = z.enum(["local", "preview", "production"]);

export type TenvironmentSchema = z.infer<typeof environmentSchema>;

export const createEventSchema = z.object({
  ...eventBaseSchema.shape,
  batasDaftar: z.date({
    error: "Silakan tentukan batas pendaftaran",
  }),
  dateTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam tidak valid")
    .optional(),
  batasDaftarTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam tidak valid")
    .optional(),
  fileKey: z.string().min(1, "Gambar/File wajib diunggah"),
  environment: environmentSchema,
});

export type TcreateEventSchema = z.infer<typeof createEventSchema>;

export const updateEventField = eventBaseSchema;

export type TUpdateEventField = z.infer<typeof updateEventField>;
