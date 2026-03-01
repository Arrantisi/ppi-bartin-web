"use server";

import { studentAccount } from "@/server/actions/account";
import prisma from "@/lib/prisma";
import { TcreateEventSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { TServerPrompt } from "@/types";
import { createSlug } from "@/utils/slug";

export const createAcara = async ({
  judul,
  deskripsi,
  date,
  lokasi,
  maxCapacity,
  biayaAcara,
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
        biayaAcara: biayaAcara,
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
    biayaAcara,
    batasDaftar,
    fileKey,
    catagory,
    persyaratan,
  }: TcreateEventSchema,
): Promise<TServerPrompt> => {
  await studentAccount();

  try {
    const updattedSlug = createSlug(judul);

    await prisma.events.update({
      where: { slug },
      data: {
        biayaAcara: biayaAcara,
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
