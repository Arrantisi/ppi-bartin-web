"use server";

import { UTApi } from "uploadthing/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { studentAccount, getCurrentUserRole } from "@/server/actions/account";
import type { TServerPrompt } from "@/types";

const utapi = new UTApi();

const ADMIN_ROLES = new Set(["ADMIN", "PENGURUS"]);

// UploadThing menghasilkan key acak base62. Batasi agar tidak ada path traversal,
// CRLF injection, atau string raksasa yang bisa dipakai exhausting argumen.
const fileKeySchema = z
  .string()
  .min(8, "Key file terlalu pendek")
  .max(200, "Key file terlalu panjang")
  .regex(/^[A-Za-z0-9_-]+$/, "Key file tidak valid");

/**
 * Terimaeither URL lengkap (`https://.../ufs.sh/f/<key>`) maupun key polos.
 * Pakai `new URL()` supaya query string tidak ikut terambil — cara lama
 * `url.split("/f/")[1]` bocorkan `?x=1` ke key.
 */
function extractFileKey(input: string): string | null {
  if (!/^https?:\/\//i.test(input)) return input;

  try {
    const { pathname } = new URL(input);
    const marker = "/f/";
    const idx = pathname.indexOf(marker);
    if (idx === -1) return null;
    return pathname.slice(idx + marker.length) || null;
  } catch {
    return null;
  }
}

/**
 * True bila key masih dipakai oleh record milik user LAIN.
 * Record milik user sendiri diizinkan (mis. sedang ganti foto profil).
 * Key yang tidak direferensikan siapa pun (orphan) juga diizinkan — semua
 * pemanggil internal menghapus row-nya lebih dulu sebelum membersihkan file.
 */
async function isOwnedByAnother(key: string, userId: string): Promise<boolean> {
  const [user, news, events, ticketFile] = await Promise.all([
    prisma.user.findFirst({
      where: { image: key, NOT: { id: userId } },
      select: { id: true },
    }),
    prisma.news.findFirst({
      where: { fileKey: key, creator: { NOT: { id: userId } } },
      select: { id: true },
    }),
    prisma.events.findFirst({
      where: { fileKey: key, creator: { NOT: { id: userId } } },
      select: { id: true },
    }),
    prisma.customerServiceFile.findFirst({
      where: { fileKey: key, ticket: { userId: { not: userId } } },
      select: { id: true },
    }),
  ]);

  return Boolean(user || news || events || ticketFile);
}

export async function deleteUploadedFile(
  fileKey: string,
): Promise<TServerPrompt<void>> {
  try {
    // 1. Auth — action ini menghapus aset, jadi wajib punya sesi valid.
    const session = await studentAccount().catch(() => null);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Parse key dari URL bila perlu.
    const raw = extractFileKey(fileKey);
    if (!raw) {
      return { success: false, error: "Key file tidak valid" };
    }

    // 3. Validasi bentuk key.
    const parsed = fileKeySchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: "Key file tidak valid" };
    }
    const key = parsed.data;

    // 4. Admin/PENGURUS boleh cleans up aset milik orang lain (mis. hapus tiket).
    const role = await getCurrentUserRole();
    if (!ADMIN_ROLES.has(role)) {
      // 5. Ownership — cegah penghapusan file milik user lain.
      if (await isOwnedByAnother(key, session.user.id)) {
        return { success: false, error: "Forbidden" };
      }
    }

    await utapi.deleteFiles(key);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("[delete-upload] gagal:", error);
    return { success: false, error: "Gagal menghapus file" };
  }
}
