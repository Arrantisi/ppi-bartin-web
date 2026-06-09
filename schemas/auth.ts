import * as z from "zod";

const usernameSchema = z
  .string()
  .min(4, "Username minimal 4 karakter")
  .max(16, "Username maksimal 16 karakter")
  .regex(/^[a-zA-Z0-9_.-]+$/, "Gunakan hanya huruf, angka, dan karakter ._-, tanpa spasi");

export const formUsername = z.object({
  username: usernameSchema,
});

export type FormUsername = z.infer<typeof formUsername>;

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
