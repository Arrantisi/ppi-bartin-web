"use server";

import { prisma } from "@/lib/db";

export const getCustomerServiceData = async () => {
  const tickets = await prisma.customerService.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      files: {
        select: {
          id: true,
          fileKey: true,
          fileUrl: true,
          name: true,
        },
      },
    },
  });

  return tickets;
};

export type TgetCustomerServiceData = Awaited<ReturnType<typeof getCustomerServiceData>>;
