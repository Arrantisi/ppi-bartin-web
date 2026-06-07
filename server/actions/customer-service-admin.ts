"use server";

import { prisma } from "@/lib/db";
import { TServerPrompt } from "@/types";
import { getCurrentUserRole, studentAccount } from "./account";
import { deleteUploadedFile } from "./delete-upload";

const authorizeAdmin = async () => {
  const role = await getCurrentUserRole();
  if (role !== "ADMIN" && role !== "PENGURUS") {
    throw new Error("Forbidden");
  }
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
        readBy: {
          select: { id: true, name: true, image: true, role: true },
        },
        resolvedBy: {
          select: { id: true, name: true, image: true, role: true },
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
    const { user } = await studentAccount();
    await authorizeAdmin();

    const data: { status: string; resolvedAt?: Date; readById?: string; resolvedById?: string } = { status };
    if (status === "READ") {
      data.readById = user.id;
    }
    if (status === "RESOLVED") {
      data.resolvedAt = new Date();
      data.resolvedById = user.id;
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

export const deleteTicket = async (
  id: string,
): Promise<TServerPrompt> => {
  try {
    await authorizeAdmin();

    const ticket = await prisma.customerService.findUnique({
      where: { id },
      include: { files: { select: { fileKey: true } } },
    });
    if (!ticket) {
      return { status: "error", msg: "Tiket tidak ditemukan" };
    }

    await Promise.allSettled(
      ticket.files.map((file) => deleteUploadedFile(file.fileKey)),
    );

    await prisma.customerService.delete({ where: { id } });

    return { status: "success", msg: "Tiket berhasil dihapus" };
  } catch (error) {
    console.error(error);
    return { status: "error", msg: "Gagal menghapus tiket" };
  }
};
