"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface IServerPrompt {
	status: "error" | "success";
	msg: string;
}

export const deleteAccount = async (): Promise<IServerPrompt> => {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) throw new Error("Unauthorized");

	try {
		await prisma.user.delete({
			where: {
				id: session.user.id,
			},
		});

		return {
			status: "success",
			msg: "account berhasil dihapus!",
		};
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