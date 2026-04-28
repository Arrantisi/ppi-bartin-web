"use server";

import prisma from "@/lib/prisma";
import { TcreateNewsSchema } from "@/schemas";
import { TServerPrompt } from "@/types";
import { createSlug } from "@/utils/slug";
import { revalidatePath } from "next/cache";
import { studentAccount } from "./account";
import { sendPushToAll } from "@/lib/send-push";

export const deleteNews = async (newsId: string): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  try {
    await prisma.news.delete({
      where: { id: newsId, userId: user.id },
    });

    return {
      status: "success",
      msg: "Berita telah di hapus dari draft",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server delete Berita",
    };
  }
};

export const updateNews = async (
  slug: string,
  { judul, catagory, desckripsi, fileKey, ringkasan }: TcreateNewsSchema,
): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  try {
    const updatedSlug = createSlug(judul);
    const ownedNews = await prisma.news.findFirst({
      where: { slug, userId: user.id },
      select: { id: true },
    });
    if (!ownedNews) {
      return {
        status: "error",
        msg: "Kamu tidak memiliki akses untuk mengubah berita ini",
      };
    }

    await prisma.news.update({
      where: { id: ownedNews.id },
      data: {
        catagory,
        desckripsi,
        fileKey,
        ringkasan,
        judul,
        slug: updatedSlug,
      },
    });

    return {
      status: "success",
      msg: "Photo telah disimpan",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server delete acara",
    };
  }
};

export const createNews = async ({
  judul,
  catagory,
  desckripsi,
  fileKey,
  ringkasan,
}: TcreateNewsSchema): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  const slug = createSlug(judul);

  try {
    await prisma.news.create({
      data: {
        catagory,
        desckripsi,
        fileKey,
        ringkasan,
        judul,
        slug,
        userId: user.id,
      },
    });

    await sendPushToAll({
      title: "📰 Kabar Bartin Hari Ini",
      message: `${judul}`,
      url: `/home/news/${slug}`,
    });

    revalidatePath(`/home/news/uploader/${slug}`);
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
