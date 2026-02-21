"use server";

import prisma from "@/lib/prisma";

export const getNewsBySlug = async (slug: string) => {
  return await prisma.news.findUnique({
    where: { slug },
    select: {
      catagory: true,
      content: true,
      createdAt: true,
      creator: {
        select: {
          image: true,
          username: true,
        },
      },
      judul: true,
      status: true,
      images: {
        select: {
          key: true,
          name: true,
          url: true,
        },
      },
    },
  });
};

export type TGetNewsBySlug = Awaited<ReturnType<typeof getNewsBySlug>>;

export const getNews = async () => {
  return await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      slug: true,
      catagory: true,
      content: true,
      createdAt: true,
      creator: {
        select: {
          image: true,
          username: true,
        },
      },
      judul: true,
      status: true,
      images: {
        select: {
          key: true,
          name: true,
          url: true,
        },
      },
    },
  });
};

export type TGetNews = Awaited<ReturnType<typeof getNews>>[0];
