import * as z from "zod";

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
