"use server";

import { studentAccount } from "@/lib/account";
import prisma from "@/lib/prisma";
import { FormAcara, TPostJudulSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { TServerPrompt } from "@/types";
import { createSlug } from "@/utils/slug";

export const postEvent = async ({
  judul,
}: TPostJudulSchema): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  const slug = createSlug(judul);

  try {
    await prisma.events.create({
      data: {
        slug,
        judul,
        userId: user.id,
      },
    });
    revalidatePath(`/home/events/uploader/${slug}`);

    return {
      status: "success",
      msg: slug,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server delete acara",
    };
  }
};

export const deleteEvent = async (eventId: string) => {
  const { user } = await studentAccount();

  try {
    await prisma.events.delete({
      where: { id: eventId, userId: user.id },
    });

    return {
      status: "success",
      msg: "Acara telah di hapus dari draft",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server delete acara",
    };
  }
};

export const joinEvent = async (eventId: string): Promise<TServerPrompt> => {
  const session = await studentAccount();

  try {
    await prisma.participants.create({
      data: {
        eventId,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      msg: "kamu sudah berhasil join acara",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server join acara",
    };
  }
};

export const publishAcara = async (slug: string): Promise<TServerPrompt> => {
  await studentAccount();

  try {
    await prisma.events.update({
      where: { slug },
      data: { status: "PUSBLISH" },
    });

    return {
      status: "success",
      msg: "acara berhasil di publish",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server publish acara",
    };
  }
};

export const updateEventPhoto = async (
  slug: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[],
): Promise<TServerPrompt> => {
  await studentAccount();

  try {
    await prisma.events.update({
      where: { slug },
      data: {
        images: {
          create: images.map((img) => ({
            url: img.url,
            key: img.key,
            name: img.name,
          })),
        },
      },
    });

    return {
      status: "success",
      msg: "Photo acara berhasil di update",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server update acara",
    };
  }
};

export const updateAcara = async ({
  content,
  date,
  judul,
  lokasi,
  slug,
  maxCapacity,
}: FormAcara): Promise<TServerPrompt> => {
  await studentAccount();

  try {
    await prisma.events.update({
      where: { slug },
      data: { content, date, judul, lokasi, slug, maxCapacity },
    });

    return {
      status: "success",
      msg: "Acara berhasil di update",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server update acara",
    };
  }
};

export const createAcara = async ({
  slug,
  content,
  date,
  judul,
  lokasi,
  maxCapacity,
}: FormAcara) => {
  const session = await studentAccount();

  try {
    await prisma.events.create({
      data: {
        maxCapacity,
        content,
        date,
        judul,
        lokasi,
        slug,
        userId: session.user.id,
      },
    });
    revalidatePath(`/previews/${slug}`);

    return {
      status: "success",
      msg: "Acara berhasil di buat",
      slug: slug,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server buat acara",
    };
  }
};
