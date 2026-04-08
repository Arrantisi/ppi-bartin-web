"use server";

import { studentAccount } from "@/server/actions/account";
import prisma from "@/lib/prisma";
import { createEventSchema, TcreateEventSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { TServerPrompt } from "@/types";
import { createSlug } from "@/utils/slug";
import { sendPushToAll } from "@/lib/send-push";

export const createAcara = async ({
  judul,
  deskripsi,
  date,
  lokasi,
  maxCapacity,
  batasDaftar,
  fileKey,
  catagory,
  persyaratan,
}: TcreateEventSchema): Promise<TServerPrompt> => {
  const { user } = await studentAccount();
  const validation = createEventSchema.safeParse({
    judul,
    deskripsi,
    date,
    lokasi,
    maxCapacity,
    batasDaftar,
    fileKey,
    catagory,
    persyaratan,
  });
  if (!validation.success) {
    return {
      status: "error",
      msg: "Data acara tidak valid",
    };
  }

  const slug = createSlug(judul);

  try {
    await prisma.events.create({
      data: {
        batasDaftar,
        fileKey,
        catagory,
        persyaratan,
        slug,
        judul,
        userId: user.id,
        deskripsi,
        maxCapacity,
        date,
        lokasi,
      },
    });

    await sendPushToAll({
      title: "Acara Baru di PPI Bartin! 🏛️",
      message: `Ada acara: ${judul}. Yuk cek detailnya!`,
      url: `/acara/${slug}`,
    });

    return {
      status: "success",
      msg: "berhasil membuat acara",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server create acara, silahkan hubungi admin",
    };
  }
};

export const updateAcara = async (
  slug: string,
  {
    judul,
    deskripsi,
    date,
    lokasi,
    maxCapacity,

    batasDaftar,
    fileKey,
    catagory,
    persyaratan,
  }: TcreateEventSchema,
): Promise<TServerPrompt> => {
  const { user } = await studentAccount();
  const validation = createEventSchema.safeParse({
    judul,
    deskripsi,
    date,
    lokasi,
    maxCapacity,

    batasDaftar,
    fileKey,
    catagory,
    persyaratan,
  });
  if (!validation.success) {
    return {
      status: "error",
      msg: "Data acara tidak valid",
    };
  }

  try {
    const updattedSlug = createSlug(judul);
    const ownedEvent = await prisma.events.findFirst({
      where: { slug, userId: user.id },
      select: { id: true },
    });
    if (!ownedEvent) {
      return {
        status: "error",
        msg: "Kamu tidak memiliki akses untuk mengubah acara ini",
      };
    }

    await prisma.events.update({
      where: { id: ownedEvent.id },
      data: {
        batasDaftar,
        fileKey,
        catagory,
        persyaratan,
        slug: updattedSlug,
        judul,

        deskripsi,
        maxCapacity,
        date,
        lokasi,
      },
    });

    revalidatePath("/home/events");
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

export const deleteEvent = async (eventId: string): Promise<TServerPrompt> => {
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
  const { user } = await studentAccount();

  try {
    const ownedEvent = await prisma.events.findFirst({
      where: { slug, userId: user.id },
      select: { id: true },
    });
    if (!ownedEvent) {
      return {
        status: "error",
        msg: "Kamu tidak memiliki akses untuk publish acara ini",
      };
    }

    await prisma.events.update({
      where: { id: ownedEvent.id },
      data: {},
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
