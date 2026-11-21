import * as z from "zod";
import { CATAGORY_BERITA } from "./utils";

const environmentSchema = z.enum(["local", "preview", "production"]);

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
