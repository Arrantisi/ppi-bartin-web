import * as z from "zod";

export const formUsername = z.object({
  username: z
    .string()
    .min(2, "Username minimal 2 karakter")
    .max(12, "Username maksimal 12 karakter"),
});

export type FormUsername = z.infer<typeof formUsername>;

export const formCreateBerita = z.object({
  judul: z.string().min(8, "Judul berita minimal 8 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  content: z.string().min(8, "Isi berita terlalu pendek, minimal 8 karakter"),
  catagory: z.string().min(1, "Silakan pilih kategori"),
});

export type FormCreateBerita = z.infer<typeof formCreateBerita>;

export const formAcara = z.object({
  judul: z.string().min(8, "Nama agenda minimal 8 karakter"),
  lokasi: z.string().min(1, "Lokasi acara wajib diisi"),
  date: z.date({ error: "Silakan tentukan tanggal acara" }),
  content: z.string().min(8, "Deskripsi acara minimal 8 karakter"),
  slug: z.string().min(3, "Slug unik wajib diisi"),
  maxCapacity: z
    .number({ error: "Kapasitas harus berupa angka" })
    .int("Harus berupa bilangan bulat")
    .min(1, "Kapasitas minimal 1 orang"),
});

export type FormAcara = z.infer<typeof formAcara>;

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
