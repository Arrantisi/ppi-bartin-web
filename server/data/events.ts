"use server";

import prisma from "@/lib/prisma";
import { studentAccount } from "../actions/account";

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

export const getEventBySlug = async (slug: string) => {
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
