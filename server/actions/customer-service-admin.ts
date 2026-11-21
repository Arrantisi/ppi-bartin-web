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

export const getTicketById = async (id: string) => {
  try {
    await authorizeAdmin();

    const ticket = await prisma.customerService.findUnique({
      where: { id },
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

    if (!ticket) return { success: false, error: "Tiket tidak ditemukan" };

    return { success: true, data: ticket };
  } catch (error) {
    console.error(error);
    return { success: false, error: "gagal mengambil data tiket" };
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

    return { success: true, data: tickets };
  } catch (error) {
    console.error(error);
    return { success: false, error: "gagal mengambil data" };
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

    return { message: "status berhasil diperbarui", success: true, data: undefined };
  } catch (error) {
    console.error(error);
    return { error: "gagal memperbarui status", success: false };
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
      return { success: false, error: "Tiket tidak ditemukan" };
    }

    await Promise.allSettled(
      ticket.files.map((file) => deleteUploadedFile(file.fileKey)),
    );

    await prisma.customerService.delete({ where: { id } });

    return { success: true, data: undefined, message: "Tiket berhasil dihapus" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal menghapus tiket" };
  }
};
