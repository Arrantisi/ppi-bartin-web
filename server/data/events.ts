"use server";

import { prisma } from "@/lib/db";
import { getCurrentUserRole } from "../actions/account";

const getEnvironmentFilter = async (): Promise<string[]> => {
  const role = await getCurrentUserRole();

  if (role === "ADMIN") return ["local", "preview", "production"];
  if (role === "PENGURUS") return ["preview", "production"];
  return ["production"];
};

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
  const allowed = await getEnvironmentFilter();

  const data = await prisma.events.findMany({
    where: { environment: { in: allowed } },
    include: {
      creator: {
        select: { username: true, image: true, id: true, name: true },
      },
      participants: { select: { user: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return data;
};

export type TgetAllEvent = Awaited<ReturnType<typeof getAllEvents>>[0];

export const getEventBySlug = async (slug: string) => {
  const allowed = await getEnvironmentFilter();

  return await prisma.events.findFirst({
    where: { slug, environment: { in: allowed } },
    include: {
      creator: {
        select: { username: true, image: true, id: true, name: true },
      },
      participants: { select: { user: true, id: true } },
    },
  });
};

export type TgetEventBySlug = Awaited<ReturnType<typeof getEventBySlug>>;
