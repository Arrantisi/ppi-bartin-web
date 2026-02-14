import * as z from "zod";

export const formCreateBerita = z.object({
  judul: z.string().min(8, "nomor setidak nya paling sedikit 8 angka"),
  slug: z.string().min(3),
  content: z.string().min(8, "nomor setidak nya paling sedikit 8 angka"),
  catagory: z.string(),
});

export type FormCreateBerita = z.infer<typeof formCreateBerita>;

export const formAcara = z.object({
  judul: z.string().min(8, "nomor setidak nya paling sedikit 8 angka"),
  lokasi: z.string(),
  date: z.date(),
  content: z.string().min(8, "nomor setidak nya paling sedikit 8 angka"),
  slug: z.string().min(3),
});

export type FormAcara = z.infer<typeof formAcara>;

export const formSchema = z.object({
  nomor_siswa: z
    .string()
    .min(8, "nomor setidak nya paling sedikit 8 angka")
    .max(8, "nomor setidak nya paling banyak 8 angka"),
  nama_siswa: z
    .string()
    .min(5, "nama setidak nya paling sedikit 5 karakter")
    .max(32, "nama setidak nya paling banyak 32 karakter"),
});

export type FormSchema = z.infer<typeof formSchema>;

export const gantiNamaSiswaSchema = z.object({
  nama_siswa: z
    .string()
    .min(5, "nama setidak nya paling sedikit 5 karakter")
    .max(32, "nama setidak nya paling banyak 32 karakter"),
});

export type GantiNamaSiswaSchema = z.infer<typeof gantiNamaSiswaSchema>;

export const gantiNomorSiswaSchema = z.object({
  nomor_siswa: z
    .string()
    .min(8, "nomor setidak nya paling sedikit 8 angka")
    .max(8, "nomor setidak nya paling banyak 8 angka"),
});

export type GantiNomorSiswaSchema = z.infer<typeof gantiNomorSiswaSchema>;
