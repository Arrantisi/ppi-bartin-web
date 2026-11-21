import * as z from "zod";
import {
  ANGKATAN_OPTIONS,
  JENIS_KELAMIN_OPTIONS,
  STATUS_PELAJAR_OPTIONS,
} from "./utils";

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
    "Usia minimal 16 tahun",
  );

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

export const updateProfileSchema = z.object({
  statusPelajar: statusPelajarSchema,
  fakultas: fakultasSchema,
  fileKey: z.string().min(1, "Foto profil wajib diisi"),
  fullname: z.string().min(1, "Nama lengkap wajib diisi"),
  username: usernameSchema,
  jurusan: jurusanSchema,
  angkatan: angkatanSchema,
  email: z.string().email("Format email tidak valid"),
  telpon: telponSchema,
  noSiswa: z.string().min(1, "Nomor siswa wajib diisi"),
  Bio: z.string().or(z.undefined()),
  tanggalLahir: tanggalLahirSchema,
  jenisKelamin: jenisKelaminSchema,
  alamat: z.string().or(z.undefined()),
});

export type TupdateProfileSchema = z.infer<typeof updateProfileSchema>;
