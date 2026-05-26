"use server";

import { headers } from "next/headers";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prisma";
import { studentAccount } from "@/server/actions/account";

interface IServerPrompt {
  status: "error" | "success";
  msg: string;
}

const normalizeToUsLayout = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[ıİ]/g, "i")
    .replace(/[şŞ]/g, "s")
    .replace(/[ğĞ]/g, "g")
    .replace(/[üÜ]/g, "u")
    .replace(/[öÖ]/g, "o")
    .replace(/[çÇ]/g, "c");

export const student = async (
  no_siswa: string,
  nama_siswa: string,
): Promise<IServerPrompt> => {
  try {
    const inputNoSiswa = normalizeToUsLayout(no_siswa);
    const inputNamaSiswa = normalizeToUsLayout(nama_siswa);

    const noSiswa = await prisma.dataSiswa.findUnique({
      where: { id_siswa: inputNoSiswa },
    });

    if (!noSiswa)
      return {
        status: "error",
        msg: "nomor siswa tidak ada di database",
      };

    const dbNoSiswa = normalizeToUsLayout(noSiswa.id_siswa);
    const dbNamaSiswa = noSiswa.nama_siswa
      ? normalizeToUsLayout(noSiswa.nama_siswa)
      : undefined;

    if (dbNoSiswa !== inputNoSiswa || dbNamaSiswa !== inputNamaSiswa)
      return {
        status: "error",
        msg: "data siswa tidak cocok dengan data di database",
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
        msg: "no siswa sudah ada di database, coba login menggunakan email yang telah terdaftar sebelumnya",
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
      msg: "Profile kamu sudah cocok",
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
      msg: "Terjadi kesalahan pada server",
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
      msg: "Terjadi kesalahan pada server",
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
