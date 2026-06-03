"use server";

import { prisma } from "@/lib/db";
import { userSession } from "./users";

const getEnvironmentFilter = async (): Promise<string[]> => {
  const session = await userSession();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (role === "ADMIN") return ["local", "preview", "production"];
  if (role === "PENGURUS") return ["preview", "production"];
  return ["production"];
};

export const getNewsBySlug = async (slug: string) => {
  const allowed = await getEnvironmentFilter();

  return await prisma.news.findFirst({
    where: { slug, environment: { in: allowed } },
    select: {
      id: true,
      slug: true,
      catagory: true,
      desckripsi: true,
      fileKey: true,
      environment: true,
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
  const allowed = await getEnvironmentFilter();

  return await prisma.news.findMany({
    where: { environment: { in: allowed } },
    orderBy: { createdAt: "desc" },
    select: {
      slug: true,
      catagory: true,
      desckripsi: true,
      fileKey: true,
      createdAt: true,
      environment: true,
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
