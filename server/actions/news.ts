"use server";

import prisma from "@/lib/prisma";
import { TUpdateNewsSchema, TcreateNewsSchema } from "@/schemas";
import { TServerPrompt } from "@/types";
import { createSlug } from "@/utils/slug";
import { revalidatePath } from "next/cache";
import { studentAccount } from "./account";

export const updateNewsContent = async (
  slug: string,
  { catagory, desckripsi, judul }: TUpdateNewsSchema,
): Promise<TServerPrompt> => {
  await studentAccount();
  try {
    const updateedSlug = createSlug(judul);

    await prisma.news.update({
      where: { slug },
      data: {
        catagory,
        desckripsi,
        judul,
        slug: updateedSlug,
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
