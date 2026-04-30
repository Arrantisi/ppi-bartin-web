import * as z from "zod";
import {
  ANGKATAN_OPTIONS,
  CATAGORY_BERITA,
  CATEGORY_VALUES,
  JENIS_KELAMIN_OPTIONS,
  STATUS_PELAJAR_OPTIONS,
} from "./utils";

export const formPersonalSchema = z.object({
  username: z
    .string()
    .min(2, "Username minimal 2 karakter")
    .max(12, "Username maksimal 12 karakter"),
  telpon: z.string().min(8),
  jenisKelamin: z
    .string()
    .refine((value) => JENIS_KELAMIN_OPTIONS.includes(value as never), {
      message: "Jenis kelamin harus laki-laki atau perempuan",
    }),
  tanggalLahir: z.date({
    error: "Silakan tentukan tanggal lahir anda",
  }),
  statusPelajar: z
    .string()
    .refine((value) => STATUS_PELAJAR_OPTIONS.includes(value as never), {
      message: "Status pelajar tidak valid",
    }),
  fakultas: z.string().min(3, "Fakultas minimal 3 karakter"),
  jurusan: z.string().min(3, "Jurusan minimal 3 karakter"),
  angkatan: z
    .string()
    .refine((value) => ANGKATAN_OPTIONS.includes(value as never), {
      message: "Angkatan tidak valid",
    }),
});

export type FormPersonalSchema = z.infer<typeof formPersonalSchema>;

export const customerServiceSchema = z.object({
  catagory: z.string().min(2, "catagory minimal 2 karakter"),
  subject: z.string().min(2, "subject minimal 2 karakter"),
  message: z.string().min(2, "message minimal 2 karakter"),
  level: z.string().min(2, "level minimal 2 karakter"),
});

export type TcustomerServiceSchema = z.infer<typeof customerServiceSchema>;

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
});

export type TcreateNewsSchema = z.infer<typeof createNewsSchema>;

export const updateProfileSchema = z.object({
  statusPelajar: z
    .string()
    .refine((value) => STATUS_PELAJAR_OPTIONS.includes(value as never), {
      message: "Status pelajar tidak valid",
    }),
  fakultas: z.string().min(3, "Fakultas minimal 3 karakter"),
  fileKey: z.string().min(1, "Foto profil wajib diisi"),
  fullname: z.string().min(1, "Nama lengkap wajib diisi"),
  username: z
    .string()
    .min(2, "Username minimal 2 karakter")
    .max(12, "Username maksimal 12 karakter"),
  jurusan: z.string().min(3, "Jurusan minimal 3 karakter"),
  angkatan: z
    .string()
    .refine((value) => ANGKATAN_OPTIONS.includes(value as never), {
      message: "Angkatan tidak valid",
    }),
  email: z.email("Format email tidak valid"),
  telpon: z.string().or(z.undefined()),
  noSiswa: z.string().min(1, "Nomor siswa wajib diisi"),
  Bio: z.string().or(z.undefined()),
  tanggalLahir: z.date().or(z.undefined()),
  jenisKelamin: z
    .string()
    .refine((value) => JENIS_KELAMIN_OPTIONS.includes(value as never), {
      message: "Jenis kelamin harus laki-laki atau perempuan",
    }),
  alamat: z.string().or(z.undefined()),
});

export type TupdateProfileSchema = z.infer<typeof updateProfileSchema>;

export const formUsername = z.object({
  username: z
    .string()
    .min(2, "Username minimal 2 karakter")
    .max(12, "Username maksimal 12 karakter"),
});

export type FormUsername = z.infer<typeof formUsername>;

export const createEventSchema = z
  .object({
    judul: z
      .string()
      .min(8, "Nama agenda minimal 8 karakter")
      .max(100, "Judul terlalu panjang"),
    lokasi: z.string().min(1, "Lokasi acara wajib diisi"),
    date: z.date({
      error: "Silakan tentukan tanggal acara",
    }),
    deskripsi: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
    batasDaftar: z.date({
      error: "Silakan tentukan batas pendaftaran",
    }),
    fileKey: z.string().min(1, "Gambar/File wajib diunggah"),
    // Validasi kategori agar sesuai dengan list

    catagory: z
      .string()
      .refine((value) => CATEGORY_VALUES.includes(value as never), {
        message: "Pilih kategori yang valid",
      }),
    persyaratan: z.string().min(8, "Persyaratan minimal 8 karakter"),
    maxCapacity: z
      .number({ error: "Kapasitas harus berupa angka" })
      .int("Harus berupa bilangan bulat")
      .min(1, "Kapasitas minimal 1 orang"),
  })
  .refine((data) => data.batasDaftar <= data.date, {
    message: "Batas pendaftaran tidak boleh melewati tanggal acara",
    path: ["batasDaftar"], // Pesan error akan muncul di field batasDaftar
  });

export type TcreateEventSchema = z.infer<typeof createEventSchema>;

export const updateEventField = z.object({
  judul: z.string().min(8, "Nama agenda minimal 8 karakter"),
  lokasi: z.string().min(1, "Lokasi acara wajib diisi"),
  date: z.date({ error: "Silakan tentukan tanggal acara" }),
  deskripsi: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
  maxCapacity: z
    .number({ error: "Kapasitas harus berupa angka" })
    .int("Harus berupa bilangan bulat")
    .min(1, "Kapasitas minimal 1 orang"),
});

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
