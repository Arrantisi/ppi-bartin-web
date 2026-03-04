import * as z from "zod";

export const createNewsSchema = z.object({
  judul: z
    .string()
    .min(8, "Nama agenda minimal 8 karakter")
    .max(100, "Judul tidak boleh lebih dari 100 kata"),
  desckripsi: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
  fileKey: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
  catagory: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
  ringkasan: z
    .string()
    .min(8, "Deskripsi acara minimal 8 karakter")
    .max(100, "Ringkasan tidak boleh lebih dari 100 kata"),
});

export type TcreateNewsSchema = z.infer<typeof createNewsSchema>;

export const updateProfileSchema = z.object({
  statusPelajar: z.string().min(3),
  fakultas: z.string().min(3),
  fileKey: z.string(),
  fullname: z.string(),
  username: z
    .string()
    .min(2, "Username minimal 2 karakter")
    .max(12, "Username maksimal 12 karakter"),
  jurusan: z.string().min(3, "karakter"),
  angkatan: z.string().min(3, "minimal 3 karakter"),
  email: z.email(),
  telpon: z.string().or(z.undefined()),
  noSiswa: z.string(),
  Bio: z.string().or(z.undefined()),
  tanggalLahir: z.date().or(z.undefined()),
  jenisKelamin: z.string().or(z.undefined()),
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

export const createEventSchema = z.object({
  judul: z
    .string()
    .min(8, "Nama agenda minimal 8 karakter")
    .max(100, "Judul tidak boleh lebih dari 100 kata"),
  lokasi: z.string().min(1, "Lokasi acara wajib diisi"),
  date: z.date({ error: "Silakan tentukan tanggal acara" }),
  deskripsi: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
  biayaAcara: z.string().min(2, "Deskripsi acara minimal 2 karakter"),
  batasDaftar: z.date({ error: "Silakan tentukan tanggal acara" }),
  fileKey: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
  catagory: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
  persyaratan: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
  maxCapacity: z
    .number({ error: "Kapasitas harus berupa angka" })
    .int("Harus berupa bilangan bulat")
    .min(1, "Kapasitas minimal 1 orang"),
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
  nomor_siswa: z.string().length(8, "Nomor induk siswa harus tepat 8 angka"),
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
