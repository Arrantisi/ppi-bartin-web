"use server";

import prisma from "@/lib/prisma";

export const getNewsBySlug = async (slug: string) => {
  return await prisma.news.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      catagory: true,
      desckripsi: true,
      fileKey: true,
      createdAt: true,
      ringkasan: true,
      creator: {
        select: {
          id: true,
          image: true,
          username: true,
          name: true,
        },
      },
      judul: true,
    },
  });
};

export type TgetNewsBySlug = Awaited<ReturnType<typeof getNewsBySlug>>;

export const getNews = async () => {
  return await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      slug: true,
      catagory: true,
      desckripsi: true,
      fileKey: true,
      createdAt: true,
      creator: {
        select: {
          image: true,
          username: true,
          name: true,
        },
      },
      judul: true,
    },
  });
};

export type TgetNews = Awaited<ReturnType<typeof getNews>>[0];
