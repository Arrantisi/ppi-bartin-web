"use server";

import { studentAccount } from "@/server/actions/account";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { TServerPrompt } from "@/types";

type CreateEntryData = {
  title: string;
  date: Date;
  time?: string;
  location?: string;
  category: string;
  description?: string;
};

export const createEntry = async (
  data: CreateEntryData,
): Promise<TServerPrompt> => {
  try {
    const { user } = await studentAccount();

    await prisma.calendarEntry.create({
      data: {
        userId: user.id,
        title: data.title,
        date: data.date,
        time: data.time,
        location: data.location,
        category: data.category,
        description: data.description,
      },
    });

    revalidatePath("/home/profile");

    return { success: true, data: undefined, message: "Kegiatan berhasil ditambahkan" };
  } catch (error) {
    console.error("Error createEntry:", error);
    return {
      success: false,
      error: "Gagal menambahkan kegiatan",
    };
  }
};

export const updateEntry = async (
  id: string,
  data: CreateEntryData,
): Promise<TServerPrompt> => {
  try {
    const { user } = await studentAccount();

    const existing = await prisma.calendarEntry.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return {
        success: false,
        error: "Kegiatan tidak ditemukan",
      };
    }

    await prisma.calendarEntry.update({
      where: { id },
      data: {
        title: data.title,
        date: data.date,
        time: data.time,
        location: data.location,
        category: data.category,
        description: data.description,
      },
    });

    revalidatePath("/home/profile");

    return { success: true, data: undefined, message: "Kegiatan berhasil diperbarui" };
  } catch (error) {
    console.error("Error updateEntry:", error);
    return {
      success: false,
      error: "Gagal memperbarui kegiatan",
    };
  }
};

export const deleteEntry = async (id: string): Promise<TServerPrompt> => {
  try {
    const { user } = await studentAccount();

    const existing = await prisma.calendarEntry.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return {
        success: false,
        error: "Kegiatan tidak ditemukan",
      };
    }

    await prisma.calendarEntry.delete({ where: { id } });

    revalidatePath("/home/profile");

    return { success: true, data: undefined, message: "Kegiatan berhasil dihapus" };
  } catch (error) {
    console.error("Error deleteEntry:", error);
    return {
      success: false,
      error: "Gagal menghapus kegiatan",
    };
  }
};
