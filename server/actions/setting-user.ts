"use server";

import { TServerPrompt } from "@/types";
import { headers } from "next/headers";
import { auth } from "../../lib/auth";
import { prisma } from "@/lib/db";

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
): Promise<TServerPrompt> => {
  try {
    const inputNoSiswa = normalizeToUsLayout(no_siswa);
    const inputNamaSiswa = normalizeToUsLayout(nama_siswa);

    const noSiswa = await prisma.dataSiswa.findUnique({
      where: { id_siswa: inputNoSiswa },
    });

    if (!noSiswa)
      return {
        success: false,
        error: "nomor siswa tidak ada di database, cek kembali atau hubungi ADK PPI Bartin",
      };

    const dbNoSiswa = normalizeToUsLayout(noSiswa.id_siswa);
    const dbNamaSiswa = noSiswa.nama_siswa
      ? normalizeToUsLayout(noSiswa.nama_siswa)
      : undefined;

    if (dbNoSiswa !== inputNoSiswa || dbNamaSiswa !== inputNamaSiswa)
      return {
        success: false,
        error: "data siswa tidak cocok dengan data di database, cek kembali atau hubungi ADK PPI Bartin",
      };

    return {
      success: true,
      data: undefined,
      message: "berhasil",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "masalah pada server student",
    };
  }
};

export const completeProfile = async (
  no_siswa: string,
  nama_siswa: string,
): Promise<TServerPrompt> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    // Langkah 1: Validasi kecocokan data ke tabel dataSiswa
    const verification = await student(no_siswa, nama_siswa);

    if (!verification.success) {
      return { success: false, error: verification.error };
    }

    const userExistNoSiswa = await prisma.user.findUnique({
      where: { nomorSiswa: no_siswa },
    });

    if (userExistNoSiswa) {
      return {
        success: false,
        error: "no siswa sudah terdaftar, coba login menggunakan email yang digunakan sebelumnya",
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
      success: true,
      data: undefined,
      message: "Profile kamu sudah cocok",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // PENTING: Cek log di terminal VS Code kamu, bukan di browser!
    console.error("DEBUG ERROR:", error);

    // Jika error berasal dari Prisma (misal kolom tidak ada)
    if (error.code === "P2025") {
      return { success: false, error: "User tidak ditemukan di database" };
    }

    return {
      success: false,
      error: "Terjadi kesalahan pada server",
    };
  }
};

