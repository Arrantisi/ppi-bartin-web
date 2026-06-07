import * as z from "zod";
import {
  ANGKATAN_OPTIONS,
  CATAGORY_BERITA,
  JENIS_KELAMIN_OPTIONS,
  STATUS_PELAJAR_OPTIONS,
} from "./utils";
import { startOfDay } from "date-fns/startOfDay";

const usernameSchema = z
  .string()
  .min(4, "Username minimal 4 karakter")
  .max(16, "Username maksimal 16 karakter")
  .regex(/^[a-zA-Z0-9_.-]+$/, "Gunakan hanya huruf, angka, dan karakter ._-, tanpa spasi");

const telponSchema = z
  .string()
  .min(8, "Nomor telepon minimal 8 digit");

const jenisKelaminSchema = z
  .string()
  .refine((value) => JENIS_KELAMIN_OPTIONS.includes(value as never), {
    message: "Jenis kelamin wajib diisi",
  });

const statusPelajarSchema = z
  .string()
  .refine((value) => STATUS_PELAJAR_OPTIONS.includes(value as never), {
    message: "Status pelajar tidak valid",
  });

const fakultasSchema = z
  .string()
  .refine((value) => value.trim() !== "", {
    message: "Fakultas wajib diisi",
  });

const jurusanSchema = z
  .string()
  .refine((value) => value.trim() !== "", {
    message: "Jurusan wajib diisi",
  });

const angkatanSchema = z
  .string()
  .refine((value) => ANGKATAN_OPTIONS.includes(value as never), {
    message: "Angkatan tidak valid",
  });

const tanggalLahirSchema = z
  .date({
    error: "Silakan tentukan tanggal lahir anda",
  })
  .max(
    new Date(new Date().setFullYear(new Date().getFullYear() - 16)), 
    "Usia minimal 16 tahun"
  );

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

export const formPersonalSchema = z.object({
  username: usernameSchema,
  telpon: telponSchema,
  jenisKelamin: jenisKelaminSchema,
  tanggalLahir: tanggalLahirSchema,
  statusPelajar: statusPelajarSchema,
  fakultas: fakultasSchema,
  jurusan: jurusanSchema,
  angkatan: angkatanSchema,
});

export const formPersonalSchemaPartial = formPersonalSchema.extend({
  tanggalLahir: tanggalLahirSchema,
});

export type FormPersonalSchema = z.infer<typeof formPersonalSchema>;

export const customerServiceSchema = z.object({
  catagory: z.string().min(2, "catagory minimal 2 karakter"),
  subject: z.string().min(2, "subject minimal 2 karakter"),
  message: z.string().min(2, "message minimal 2 karakter"),
  level: z.string().min(2, "level minimal 2 karakter"),
  fileKeys: z.array(z.string()).optional(),
});

export type TcustomerServiceSchema = z.infer<typeof customerServiceSchema>;

const environmentSchema = z.enum(["local", "preview", "production"]);

export type TenvironmentSchema = z.infer<typeof environmentSchema>;

export const createNewsSchema = z.object({
  judul: z
    .string()
    .min(8, "Nama agenda minimal 8 karakter")
    .max(100, "Judul tidak boleh lebih dari 100 kata"),
  desckripsi: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
  fileKey: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
  catagory: z
    .string()
    .refine((value) => CATAGORY_BERITA.includes(value as never), {
      message: "Catagory tidak valid",
    }),
  ringkasan: z
    .string()
    .min(8, "Deskripsi acara minimal 8 karakter")
    .max(100, "Ringkasan tidak boleh lebih dari 100 kata"),
  environment: environmentSchema,
});

export type TcreateNewsSchema = z.infer<typeof createNewsSchema>;

export const updateProfileSchema = z.object({
  statusPelajar: statusPelajarSchema,
  fakultas: fakultasSchema,
  fileKey: z.string().min(1, "Foto profil wajib diisi"),
  fullname: z.string().min(1, "Nama lengkap wajib diisi"),
  username: usernameSchema,
  jurusan: jurusanSchema,
  angkatan: angkatanSchema,
  email: z.email("Format email tidak valid"),
    telpon: telponSchema,
  noSiswa: z.string().min(1, "Nomor siswa wajib diisi"),
  Bio: z.string().or(z.undefined()),
  tanggalLahir: tanggalLahirSchema,
  jenisKelamin: jenisKelaminSchema,
  alamat: z.string().or(z.undefined()),
});

export type TupdateProfileSchema = z.infer<typeof updateProfileSchema>;

export const formUsername = z.object({
  username: usernameSchema,
});

export type FormUsername = z.infer<typeof formUsername>;

export const createEventSchema = z
  .object({
    ...eventBaseSchema.shape,
    batasDaftar: z.date({
      error: "Silakan tentukan batas pendaftaran",
    }),
    fileKey: z.string().min(1, "Gambar/File wajib diunggah"),
    environment: environmentSchema,
  })
  .refine((data) => startOfDay(data.batasDaftar) <= data.date, {
    message: "Batas pendaftaran tidak boleh melewati tanggal acara",
    path: ["batasDaftar"],
  });

export type TcreateEventSchema = z.infer<typeof createEventSchema>;

export const updateEventField = eventBaseSchema;

export type TUpdateEventField = z.infer<typeof updateEventField>;

export const formSchema = z.object({
  nomor_siswa: z.string().min(8, "Nomor induk siswa harus tepat 8 angka"),
  nama_siswa: z
    .string()
    .min(5, "Nama lengkap minimal 5 karakter")
    .max(32, "Nama terlalu panjang, maksimal 32 karakter"),
});

export type FormSchema = z.infer<typeof formSchema>;

export const gantiNamaSiswaSchema = z.object({
  nama_siswa: z
    .string()
    .min(5, "Nama baru minimal 5 karakter")
    .max(32, "Nama maksimal 32 karakter"),
});

export type GantiNamaSiswaSchema = z.infer<typeof gantiNamaSiswaSchema>;

export const gantiNomorSiswaSchema = z.object({
  nomor_siswa: z.string().length(8, "Nomor siswa harus terdiri dari 8 angka"),
});

export type GantiNomorSiswaSchema = z.infer<typeof gantiNomorSiswaSchema>;
