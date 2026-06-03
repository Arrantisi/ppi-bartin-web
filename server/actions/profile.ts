"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteUploadedFile } from "./delete-upload";

interface IServerPrompt {
  status: "error" | "success";
  msg: string;
}

export const deleteAccount = async (): Promise<IServerPrompt> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unauthorized");

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    const newsFiles = await prisma.news.findMany({
      where: { userId: session.user.id },
      select: { fileKey: true },
    });

    const eventFiles = await prisma.events.findMany({
      where: { userId: session.user.id },
      select: { fileKey: true },
    });

    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });

    const fileKeys = [
      user?.image,
      ...newsFiles.map((n) => n.fileKey),
      ...eventFiles.map((e) => e.fileKey),
    ].filter(Boolean) as string[];

    await Promise.all(fileKeys.map((key) => deleteUploadedFile(key)));

    return {
      status: "success",
      msg: "account berhasil dihapus!",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("DEBUG ERROR:", error);

    if (error.code === "P2025") {
      return { status: "error", msg: "User tidak ditemukan di database" };
    }

    return {
      status: "error",
      msg: "Terjadi kesalahan pada server",
    };
  }
};
