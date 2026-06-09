"use server";

import { studentAccount } from "@/server/actions/account";
import { prisma } from "@/lib/db";
import { TcreateEventSchema } from "@/schemas/event";
import { revalidatePath } from "next/cache";
import { TServerPrompt } from "@/types";
import { createSlug } from "@/utils/slug";
import { sendPushToAll } from "@/lib/push/server";
import { deleteUploadedFile } from "./delete-upload";

export const cancelParticipant = async (
  eventId: string,
  participantsId: string, // Tetap kita terima untuk validasi extra
) => {
  const MAX_CANCEL_PER_EVENT = 2;

  try {
    const { user } = await studentAccount();

    // hitung log pembatalan per event
    const cancelCount = await prisma.cancelLog.count({
      where: {
        eventId: eventId,
        userId: user.id,
      },
    });

    if (cancelCount > MAX_CANCEL_PER_EVENT) {
      return {
        success: false,
        error: `Kamu sudah mencapai batas maksimal pembatalan ${cancelCount + 1}/${MAX_CANCEL_PER_EVENT} untuk event ini.`,
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
      message: `Kamu telah membatalkan sebanyak ${cancelCount + 1}/${MAX_CANCEL_PER_EVENT}; setelah itu pendaftaran akan diblokir.`,
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error("Error cancelParticipant:", error);
    return {
      error: "Terjadi masalah pada server saat membatalkan partisipasi",
      success: false,
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
  environment,
}: TcreateEventSchema): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  const slug = createSlug(judul);

  try {
    await prisma.events.create({
      data: {
        batasDaftar,
        fileKey,
        slug,
        judul,
        userId: user.id,
        deskripsi,
        maxCapacity,
        date,
        lokasi,
        environment,
      },
    });

    if (environment === "production") {
      await sendPushToAll({
        title: "Acara Baru di PPI Bartin!",
        message: `Ada acara: ${judul}. Yuk cek detailnya!`,
        url: `/acara/${slug}`,
      });
    }

    return {
      success: true,
      data: undefined,
      message: "berhasil membuat acara",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "masalah pada server create acara, silahkan hubungi admin",
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
    environment,
  }: TcreateEventSchema,
): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  try {
    const updattedSlug = createSlug(judul);
    const ownedEvent = await prisma.events.findFirst({
      where: { slug, userId: user.id },
      select: { id: true, fileKey: true },
    });
    if (!ownedEvent) {
      return {
        success: false,
        error: "Kamu tidak memiliki akses untuk mengubah acara ini",
      };
    }

    await prisma.events.update({
      where: { id: ownedEvent.id },
      data: {
        batasDaftar,
        fileKey,
        slug: updattedSlug,
        judul,
        deskripsi,
        maxCapacity,
        date,
        lokasi,
        environment,
      },
    });

    if (ownedEvent.fileKey && ownedEvent.fileKey !== fileKey) {
      await deleteUploadedFile(ownedEvent.fileKey);
    }

    revalidatePath("/home/acara");
    return {
      success: true,
      data: undefined,
      message: "Acara berhasil di update",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "masalah pada server update acara",
    };
  }
};

export const deleteEvent = async (eventId: string): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  try {
    const event = await prisma.events.findUnique({
      where: { id: eventId, userId: user.id },
      select: { fileKey: true },
    });

    if (!event) {
      return { success: false, error: "Acara tidak ditemukan" };
    }

    await prisma.events.delete({
      where: { id: eventId, userId: user.id },
    });

    if (event.fileKey) {
      await deleteUploadedFile(event.fileKey);
    }

    return {
      success: true,
      data: undefined,
      message: "Acara telah di hapus dari draft",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "masalah pada server delete acara",
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
      success: false,
      error: "Kamu sudah di blokir dari event ini",
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
      error: "event tidak di temukan",
      success: false,
    };
  }

  if (event.participants.length > 0) {
    return {
      success: false,
      error: "kamu telah join event",
    };
  }

  if (event._count.participants >= event.maxCapacity) {
    return {
      error: "event sudah penuh",
      success: false,
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
      success: true,
      data: undefined,
      message: "kamu sudah berhasil join acara",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "masalah pada server join acara",
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
        success: false,
        error: "Kamu tidak memiliki akses untuk publish acara ini",
      };
    }

    await prisma.events.update({
      where: { id: ownedEvent.id },
      data: {},
    });

    return {
      success: true,
      data: undefined,
      message: "acara berhasil di publish",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "masalah pada server publish acara",
    };
  }
};
