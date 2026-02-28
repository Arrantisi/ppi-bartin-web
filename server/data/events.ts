"use server";

import prisma from "@/lib/prisma";
import { studentAccount } from "../actions/account";

export const getEventParticipants = async (eventId: string) => {
  const data = await prisma.events.findUnique({
    where: { id: eventId },
    select: {
      participants: {
        select: {
          user: {
            select: {
              image: true,
              name: true,
              username: true,
            },
          },
        },
      },
    },
  });

  return data?.participants ?? [];
};

export type TgetEventParticipants = Awaited<
  ReturnType<typeof getEventParticipants>
>;

export const getAllEvents = async () => {
  return await prisma.events.findMany({
    include: {
      creator: { select: { username: true, image: true } },
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
      participants: { select: { user: true } },
    },
  });
};
