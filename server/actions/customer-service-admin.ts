"use server";

import { prisma } from "@/lib/db";
import { TServerPrompt } from "@/types";
import { getCurrentUserRole } from "./account";

const authorizeAdmin = async () => {
  const role = await getCurrentUserRole();
  if (role !== "ADMIN" && role !== "PENGURUS") {
    throw new Error("Forbidden");
  }
  return role;
};

export const getTickets = async () => {
  try {
    await authorizeAdmin();

    const tickets = await prisma.customerService.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            email: true,
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

    return { status: "success" as const, data: tickets };
  } catch (error) {
    console.error(error);
    return { status: "error" as const, msg: "gagal mengambil data", data: [] };
  }
};

export const updateTicketStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}): Promise<TServerPrompt> => {
  try {
    await authorizeAdmin();

    const data: { status: string; resolvedAt?: Date } = { status };
    if (status === "RESOLVED") {
      data.resolvedAt = new Date();
    }

    await prisma.customerService.update({
      where: { id },
      data,
    });

    return { msg: "status berhasil diperbarui", status: "success" };
  } catch (error) {
    console.error(error);
    return { msg: "gagal memperbarui status", status: "error" };
  }
};
