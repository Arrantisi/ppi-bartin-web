"use server";

import { studentAccount } from "@/lib/account";
import prisma from "@/lib/prisma";

export const getAllEvents = async () => {
  return await prisma.events.findMany({
    include: {
      creator: { select: { username: true, image: true } },
      images: { select: { key: true, url: true } },
      participants: { select: { user: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAcaraPreview = async (slug: string) => {
  await studentAccount();

  return await prisma.events.findUnique({
    where: { slug },
    include: {
      creator: { select: { username: true, image: true } },
      images: { select: { key: true, url: true } },
      participants: { select: { user: true } },
    },
  });
};
