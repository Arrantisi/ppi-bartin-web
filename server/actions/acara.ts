"use server";

import { studentAccount } from "@/server/actions/account";
import prisma from "@/lib/prisma";
import { TcreateEventSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { TServerPrompt } from "@/types";
import { createSlug } from "@/utils/slug";
import { sendPushToAll } from "@/lib/send-push";

export const cancelParticipant = async (
  eventId: string,
  participantsId: string, // Tetap kita terima untuk validasi extra
): Promise<TServerPrompt> => {
  const MAX_CANCEL_PER_EVENT = 2;

  try {
    const { user } = await studentAccount();

    // hitung log pembatalan per event
    const cancelConut = await prisma.cancelLog.count({
      where: {
        eventId: eventId,
        userId: user.id,
      },
    });

    if (cancelConut > MAX_CANCEL_PER_EVENT - 1) {
      return {
        msg: `Kamu sudah mencapai batas maksimal pembatalan (${MAX_CANCEL_PER_EVENT}/${MAX_CANCEL_PER_EVENT}) untuk event ini.`,
        status: "error",
      };
    }

    await prisma.$transaction([
      prisma.participants.delete({
        where: {
          id: participantsId,
          userId: user.id,
          eventId: eventId,
        },
      }),
      prisma.cancelLog.create({
        data: {
          eventId,
          userId: user.id,
        },
      }),
    ]);

    revalidatePath("/home/events");

    return {
      msg: `Partisipasi berhasil dibatalkan (${cancelConut + 1}/${MAX_CANCEL_PER_EVENT})`,
      status: "success",
    };
  } catch (error) {
    console.error("Error cancelParticipant:", error);
    return {
      msg: "Terjadi masalah pada server saat membatalkan partisipasi",
      status: "error",
    };
  }
};

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
      title: "Acara Baru di PPI Bartin!",
      message: `Ada acara: ${judul}. Yuk cek detailnya!`,
      url: `/home/acara/${slug}`,
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
  const MAX_CANCEL_PER_EVENT = 2;

  const { user } = await studentAccount();

  const cancelCount = await prisma.cancelLog.count({
    where: {
      eventId,
      userId: user.id,
    },
  });

  if (cancelCount > MAX_CANCEL_PER_EVENT - 1) {
    return {
      status: "error",
      msg: "Kamu sudah di blokir dari event ini",
    };
  }

  const event = await prisma.events.findUnique({
    where: { id: eventId },
    include: {
      _count: {
        select: {
          participants: true,
        },
      },
      participants: {
        where: { userId: user.id },
      },
    },
  });

  if (!event) {
    return {
      msg: "event tidak di temukan",
      status: "error",
    };
  }

  if (event.participants.length > 0) {
    return {
      status: "error",
      msg: "kamu telah join event",
    };
  }

  if (event._count.participants >= event.maxCapacity) {
    return {
      msg: "event sudah penuh",
      status: "error",
    };
  }

  try {
    await prisma.participants.create({
      data: {
        eventId,
        userId: user.id,
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
