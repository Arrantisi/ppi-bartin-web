"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import {
  deleteEventSchema,
  deleteNewsSchema,
  deleteUserSchema,
  setEventEnvironmentSchema,
  setNewsEnvironmentSchema,
  setUserBanSchema,
  updateUserRoleSchema,
  type TDeleteEventInput,
  type TDeleteNewsInput,
  type TDeleteUserInput,
  type TSetEventEnvironmentInput,
  type TSetNewsEnvironmentInput,
  type TSetUserBanInput,
  type TUpdateUserRoleInput,
} from "@/schemas/admin-dashboard";
import type { TServerPrompt } from "@/types";
import type {
  TAdminEventDetail,
  TAdminNewsDetail,
  TAdminUserDetail,
} from "@/types/admin-dashboard";

import {
  getAdminEventDetail,
  getAdminNewsDetail,
  getAdminUserDetail,
} from "../data/admin-dashboard";
import { getCurrentUserRole, studentAccount } from "./account";
import { deleteUploadedFile } from "./delete-upload";

const ADMIN_ROLES = new Set(["ADMIN"]);

class ForbiddenError extends Error {
  constructor() {
    super("Forbidden");
    this.name = "ForbiddenError";
  }
}

const authorizeAdmin = async () => {
  const role = await getCurrentUserRole();
  if (!ADMIN_ROLES.has(role)) throw new ForbiddenError();
  return studentAccount();
};

const failFromError = (scope: string, error: unknown): TServerPrompt<void> => {
  if (error instanceof ForbiddenError) return fail("Forbidden");
  console.error(`[admin-dashboard] ${scope}:`, error);
  return fail("Terjadi kesalahan server");
};

const isLastActiveAdmin = async (target: {
  id: string;
  role: string;
  banned: boolean | null;
}): Promise<boolean> => {
  if (target.role !== "ADMIN" || target.banned === true) return false;
  const activeAdmins = await prisma.user.count({
    where: { role: "ADMIN", banned: { not: true } },
  });
  return activeAdmins <= 1;
};

const fieldErrorsFrom = (error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): Record<string, string[]> => {
  const flattened = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flattened).map(([key, value]) => [key, value ?? []]),
  );
};

const failPrompt = <T>(error: string): TServerPrompt<T> => ({
  success: false,
  error,
});

const fail = (error: string): TServerPrompt<void> => failPrompt(error);

/** Detail dibaca lewat server action agar client tidak mengimpor Prisma. */
async function readDetail<T>(
  scope: string,
  load: () => Promise<T | null>,
): Promise<TServerPrompt<T | null>> {
  try {
    await authorizeAdmin();
    return { success: true, data: await load() };
  } catch (error) {
    if (error instanceof ForbiddenError) return failPrompt("Forbidden");
    console.error(`[admin-dashboard] ${scope}:`, error);
    return failPrompt("Terjadi kesalahan server");
  }
}

export async function getAdminUserDetailAction(
  userId: string,
): Promise<TServerPrompt<TAdminUserDetail | null>> {
  return readDetail("getAdminUserDetailAction", () => getAdminUserDetail(userId));
}

export async function getAdminEventDetailAction(
  eventId: string,
): Promise<TServerPrompt<TAdminEventDetail | null>> {
  return readDetail("getAdminEventDetailAction", () =>
    getAdminEventDetail(eventId),
  );
}

export async function getAdminNewsDetailAction(
  newsId: string,
): Promise<TServerPrompt<TAdminNewsDetail | null>> {
  return readDetail("getAdminNewsDetailAction", () => getAdminNewsDetail(newsId));
}

export async function updateUserRole(
  input: TUpdateUserRoleInput,
): Promise<TServerPrompt<void>> {
  try {
    const session = await authorizeAdmin();
    const parsed = updateUserRoleSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: fieldErrorsFrom(parsed.error),
      };
    }

    const { userId, role } = parsed.data;
    if (userId === session.user.id) {
      return fail("Tidak dapat mengubah role akun sendiri");
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, banned: true },
    });
    if (!target) return fail("User tidak ditemukan");

    if (role !== "ADMIN" && (await isLastActiveAdmin(target))) {
      return fail("Tidak dapat menurunkan satu-satunya ADMIN aktif");
    }

    await prisma.user.update({ where: { id: userId }, data: { role } });
    revalidatePath("/dashboard/users");
    return { success: true, data: undefined, message: "Role berhasil diperbarui" };
  } catch (error) {
    return failFromError("updateUserRole", error);
  }
}

export async function setUserBan(
  input: TSetUserBanInput,
): Promise<TServerPrompt<void>> {
  try {
    const session = await authorizeAdmin();
    const parsed = setUserBanSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: fieldErrorsFrom(parsed.error),
      };
    }

    const { userId, banned, banReason, banExpires } = parsed.data;
    if (userId === session.user.id) {
      return fail("Tidak dapat memblokir akun sendiri");
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!target) return fail("User tidak ditemukan");

    await prisma.user.update({
      where: { id: userId },
      data: {
        banned,
        banReason: banned ? (banReason ?? null) : null,
        banExpires: banned ? (banExpires ? new Date(banExpires) : null) : null,
      },
    });
    revalidatePath("/dashboard/users");
    return {
      success: true,
      data: undefined,
      message: banned ? "User berhasil diblokir" : "Blokir user dibatalkan",
    };
  } catch (error) {
    return failFromError("setUserBan", error);
  }
}

export async function deleteUser(
  input: TDeleteUserInput,
): Promise<TServerPrompt<void>> {
  try {
    const session = await authorizeAdmin();
    const parsed = deleteUserSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: fieldErrorsFrom(parsed.error),
      };
    }

    const { userId } = parsed.data;
    if (userId === session.user.id) {
      return fail("Tidak dapat menghapus akun sendiri");
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        banned: true,
        image: true,
        news: { select: { fileKey: true } },
        events: { select: { fileKey: true } },
        customerServices: {
          select: { files: { select: { fileKey: true } } },
        },
      },
    });
    if (!target) return fail("User tidak ditemukan");

    if (await isLastActiveAdmin(target)) {
      return fail("Tidak dapat menghapus satu-satunya ADMIN aktif");
    }

    const fileKeys = new Set<string>();
    if (target.image) fileKeys.add(target.image);
    for (const item of target.news) if (item.fileKey) fileKeys.add(item.fileKey);
    for (const item of target.events) if (item.fileKey) fileKeys.add(item.fileKey);
    for (const ticket of target.customerServices) {
      for (const file of ticket.files) if (file.fileKey) fileKeys.add(file.fileKey);
    }

    // CustomerService.user tidak punya onDelete: Cascade, jadi tiket buatan target
    // harus dihapus lebih dulu di transaksi yang sama dengan user.delete().
    await prisma.$transaction(async (tx) => {
      await tx.customerService.updateMany({
        where: { OR: [{ readById: userId }, { resolvedById: userId }] },
        data: { readById: null, resolvedById: null },
      });
      await tx.customerService.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    const cleanupResults = await Promise.allSettled(
      [...fileKeys].map((key) => deleteUploadedFile(key)),
    );
    for (const result of cleanupResults) {
      if (result.status === "rejected" || !result.value.success) {
        console.error("[admin-dashboard] gagal membersihkan file:", result);
      }
    }

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard/news");
    return { success: true, data: undefined, message: "User berhasil dihapus" };
  } catch (error) {
    return failFromError("deleteUser", error);
  }
}

export async function setEventEnvironment(
  input: TSetEventEnvironmentInput,
): Promise<TServerPrompt<void>> {
  try {
    await authorizeAdmin();
    const parsed = setEventEnvironmentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: fieldErrorsFrom(parsed.error),
      };
    }

    const { eventId, environment } = parsed.data;
    const event = await prisma.events.findUnique({
      where: { id: eventId },
      select: { id: true },
    });
    if (!event) return fail("Event tidak ditemukan");

    await prisma.events.update({
      where: { id: eventId },
      data: { environment },
    });
    revalidatePath("/dashboard/events");
    revalidatePath("/home/acara");
    revalidatePath("/acara");
    return { success: true, data: undefined, message: "Status event diperbarui" };
  } catch (error) {
    return failFromError("setEventEnvironment", error);
  }
}

export async function deleteEvent(
  input: TDeleteEventInput,
): Promise<TServerPrompt<void>> {
  try {
    await authorizeAdmin();
    const parsed = deleteEventSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: fieldErrorsFrom(parsed.error),
      };
    }

    const { eventId } = parsed.data;
    const event = await prisma.events.findUnique({
      where: { id: eventId },
      select: { fileKey: true },
    });
    if (!event) return fail("Event tidak ditemukan");

    await prisma.events.delete({ where: { id: eventId } });
    if (event.fileKey) await deleteUploadedFile(event.fileKey);

    revalidatePath("/dashboard/events");
    revalidatePath("/home/acara");
    revalidatePath("/acara");
    return { success: true, data: undefined, message: "Event berhasil dihapus" };
  } catch (error) {
    return failFromError("deleteEvent", error);
  }
}

export async function setNewsEnvironment(
  input: TSetNewsEnvironmentInput,
): Promise<TServerPrompt<void>> {
  try {
    await authorizeAdmin();
    const parsed = setNewsEnvironmentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: fieldErrorsFrom(parsed.error),
      };
    }

    const { newsId, environment } = parsed.data;
    const news = await prisma.news.findUnique({
      where: { id: newsId },
      select: { id: true },
    });
    if (!news) return fail("Berita tidak ditemukan");

    await prisma.news.update({
      where: { id: newsId },
      data: { environment },
    });
    revalidatePath("/dashboard/news");
    revalidatePath("/home/berita");
    revalidatePath("/berita");
    return { success: true, data: undefined, message: "Status berita diperbarui" };
  } catch (error) {
    return failFromError("setNewsEnvironment", error);
  }
}

export async function deleteNews(
  input: TDeleteNewsInput,
): Promise<TServerPrompt<void>> {
  try {
    await authorizeAdmin();
    const parsed = deleteNewsSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: fieldErrorsFrom(parsed.error),
      };
    }

    const { newsId } = parsed.data;
    const news = await prisma.news.findUnique({
      where: { id: newsId },
      select: { fileKey: true },
    });
    if (!news) return fail("Berita tidak ditemukan");

    await prisma.news.delete({ where: { id: newsId } });
    if (news.fileKey) await deleteUploadedFile(news.fileKey);

    revalidatePath("/dashboard/news");
    revalidatePath("/home/berita");
    revalidatePath("/berita");
    return { success: true, data: undefined, message: "Berita berhasil dihapus" };
  } catch (error) {
    return failFromError("deleteNews", error);
  }
}
