"use server";

import { studentAccount } from "@/lib/account";
import prisma from "@/lib/prisma";
import { TPostJudulNewsSchema, TUpdateNewsSchema } from "@/schemas";
import { TServerPrompt } from "@/types";
import { createSlug } from "@/utils/slug";

export const updateNewsContent = async (
  slug: string,
  { catagory, content, judul }: TUpdateNewsSchema,
): Promise<TServerPrompt> => {
  await studentAccount();
  try {
    await prisma.news.update({
      where: { slug },
      data: { catagory, content, judul },
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

export const updateNewsPhoto = async (
  slug: string,
  images: { key: string; url: string; name: string }[],
): Promise<TServerPrompt> => {
  await studentAccount();

  try {
    await prisma.news.update({
      where: { slug },
      data: {
        images: {
          create: images.map(({ key, name, url }) => ({
            key,
            name,
            url,
          })),
        },
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

export const postNews = async ({
  judul,
}: TPostJudulNewsSchema): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  const slug = createSlug(judul);

  try {
    await prisma.news.create({
      data: {
        judul,
        slug,
        userId: user.id,
      },
    });

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
