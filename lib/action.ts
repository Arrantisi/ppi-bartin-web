"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import prisma from "./prisma";
import { studentAccount } from "./account";

interface IServerPrompt {
  status: "error" | "success";
  msg: string;
}

export const student = async (
  no_siswa: string,
  nama_siswa: string,
): Promise<IServerPrompt> => {
  try {
    const noSiswa = await prisma.dataSiswa.findUnique({
      where: { id_siswa: no_siswa },
    });
    if (!noSiswa)
      return {
        status: "error",
        msg: "nomor siswa tidak ada di database",
      };

    const namaDiDb = noSiswa.nama_siswa?.toLowerCase().trim();
    const inputNama = nama_siswa.toLocaleLowerCase().trim();

    if (namaDiDb !== inputNama)
      return {
        status: "error",
        msg: "nama siswa tidak cocok dengan nomor siswa",
      };

    return {
      status: "success",
      msg: "berhasil",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server student",
    };
  }
};

export const completeProfile = async (
  no_siswa: string,
  nama_siswa: string,
): Promise<IServerPrompt> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    // Langkah 1: Validasi kecocokan data ke tabel dataSiswa
    const verification = await student(no_siswa, nama_siswa);

    if (verification.status === "error") {
      return { status: "error", msg: verification.msg };
    }

    const userExistNoSiswa = await prisma.user.findUnique({
      where: { nomorSiswa: no_siswa },
    });

    if (userExistNoSiswa) {
      return {
        status: "error",
        msg: "no siswa sudah ada di database",
      };
    }

    // Langkah 2: Update akun User Better Auth
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        nomorSiswa: no_siswa, // PASTIKAN ini sesuai nama kolom di schema.prisma
        name: nama_siswa,
      },
    });

    return {
      status: "success",
      msg: "Profil berhasil diperbarui!",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // PENTING: Cek log di terminal VS Code kamu, bukan di browser!
    console.error("DEBUG ERROR:", error);

    // Jika error berasal dari Prisma (misal kolom tidak ada)
    if (error.code === "P2025") {
      return { status: "error", msg: "User tidak ditemukan di database" };
    }

    return {
      status: "error",
      msg: error.message || "Terjadi kesalahan pada server",
    };
  }
};

export const deleteAccount = async (): Promise<IServerPrompt> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });

    return {
      status: "success",
      msg: "account berhasil hapus diperbarui!",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // PENTING: Cek log di terminal VS Code kamu, bukan di browser!
    console.error("DEBUG ERROR:", error);

    // Jika error berasal dari Prisma (misal kolom tidak ada)
    if (error.code === "P2025") {
      return { status: "error", msg: "User tidak ditemukan di database" };
    }

    return {
      status: "error",
      msg: error.message || "Terjadi kesalahan pada server",
    };
  }
};

export const gantiNamaSiswaAction = async (
  namaSiswa: string,
): Promise<IServerPrompt> => {
  const session = await studentAccount();

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: namaSiswa },
    });

    return {
      status: "success",
      msg: "nama telah di perbarui",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "maaf! masalah pada server",
    };
  }
};

export const gantiNomorSiswaAction = async (
  nomorSiswa: string,
): Promise<IServerPrompt> => {
  const session = await studentAccount();

  const compare = await prisma.dataSiswa.findUnique({
    where: { id_siswa: nomorSiswa },
  });

  if (!compare) {
    return {
      status: "error",
      msg: "nomor yang kamu masukkan tidak ada di data",
    };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { nomorSiswa },
    });

    return {
      status: "success",
      msg: "account berhasil hapus diperbarui!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server student",
    };
  }
};
