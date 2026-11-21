import { z } from "zod";

export const adminRoleSchema = z.enum([
  "USER",
  "ADMIN",
  "PENGURUS",
  "BENDAHARA",
]);

export const adminEnvironmentSchema = z.enum([
  "local",
  "preview",
  "production",
]);

/**
 * ID user dibuat Better Auth (32 karakter alfanumerik), bukan UUID dari Prisma.
 * Event dan News memakai @default(uuid()), jadi tetap tervalidasi dengan z.uuid().
 */
export const adminUserIdSchema = z
  .string()
  .min(1, "ID user tidak valid")
  .max(128, "ID user tidak valid");

export const updateUserRoleSchema = z.object({
  userId: adminUserIdSchema,
  role: adminRoleSchema,
});

export const setUserBanSchema = z.object({
  userId: adminUserIdSchema,
  banned: z.boolean(),
  banReason: z.string().trim().max(300).nullable().optional(),
  banExpires: z
    .string()
    .datetime("Format tanggal tidak valid")
    .nullable()
    .optional()
    .refine(
      (value) => !value || new Date(value).getTime() > Date.now(),
      "Tanggal berakhir harus di masa depan",
    ),
});

export const deleteUserSchema = z.object({
  userId: adminUserIdSchema,
});

/**
 * ID untuk query detail. Sengaja terpisah dari schema mutasi agar perubahan
 * aturan hapus/blokir tidak pernah membuat kartu detail gagal dibuka.
 */
export const adminDetailIdSchema = z
  .string()
  .trim()
  .min(1, "ID tidak valid")
  .max(128, "ID tidak valid");

export const setEventEnvironmentSchema = z.object({
  eventId: z.uuid("ID event tidak valid"),
  environment: adminEnvironmentSchema,
});

export const deleteEventSchema = z.object({
  eventId: z.uuid("ID event tidak valid"),
});

export const setNewsEnvironmentSchema = z.object({
  newsId: z.uuid("ID berita tidak valid"),
  environment: adminEnvironmentSchema,
});

export const deleteNewsSchema = z.object({
  newsId: z.uuid("ID berita tidak valid"),
});

export type TUpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type TSetUserBanInput = z.infer<typeof setUserBanSchema>;
export type TDeleteUserInput = z.infer<typeof deleteUserSchema>;
export type TSetEventEnvironmentInput = z.infer<typeof setEventEnvironmentSchema>;
export type TDeleteEventInput = z.infer<typeof deleteEventSchema>;
export type TSetNewsEnvironmentInput = z.infer<typeof setNewsEnvironmentSchema>;
export type TDeleteNewsInput = z.infer<typeof deleteNewsSchema>;
