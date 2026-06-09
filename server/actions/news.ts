"use server";

import { prisma } from "@/lib/db";
import { TcreateNewsSchema } from "@/schemas/news";
import { TServerPrompt } from "@/types";
import { createSlug } from "@/utils/slug";
import { revalidatePath } from "next/cache";
import { studentAccount } from "./account";
import { sendPushToAll } from "@/lib/push/server";
import { deleteUploadedFile } from "./delete-upload";

export const deleteNews = async (newsId: string): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  try {
    const news = await prisma.news.findUnique({
      where: { id: newsId, userId: user.id },
      select: { fileKey: true },
    });

    if (!news) {
      return { success: false, error: "Berita tidak ditemukan" };
    }

    await prisma.news.delete({
      where: { id: newsId, userId: user.id },
    });

    if (news.fileKey) {
      await deleteUploadedFile(news.fileKey);
    }

    return {
      success: true,
      data: undefined,
      message: "Berita telah di hapus dari draft",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "masalah pada server delete Berita",
    };
  }
};

export const updateNews = async (
  slug: string,
  { judul, catagory, desckripsi, fileKey, ringkasan, environment }: TcreateNewsSchema,
): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  try {
    const updatedSlug = createSlug(judul);
    const ownedNews = await prisma.news.findFirst({
      where: { slug, userId: user.id },
      select: { id: true, fileKey: true },
    });
    if (!ownedNews) {
      return {
        success: false,
        error: "Kamu tidak memiliki akses untuk mengubah berita ini",
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
        environment,
      },
    });

    if (ownedNews.fileKey && ownedNews.fileKey !== fileKey) {
      await deleteUploadedFile(ownedNews.fileKey);
    }

    return {
      success: true,
      data: undefined,
      message: "Photo telah disimpan",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "masalah pada server delete acara",
    };
  }
};

export const createNews = async ({
  judul,
  catagory,
  desckripsi,
  fileKey,
  ringkasan,
  environment,
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
        environment,
      },
    });

    if (environment === "production") {
      await sendPushToAll({
        title: "Berita Bartin Hari Ini",
        message: `${judul}`,
        url: `/berita/${slug}`,
      });
    }

    revalidatePath(`/home/news/uploader/${slug}`);
    return {
      success: true,
      data: undefined,
      message: slug,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "masalah pada server delete acara",
    };
  }
};
