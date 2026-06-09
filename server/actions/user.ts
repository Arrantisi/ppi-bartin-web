"use server";

import { studentAccount } from "../actions/account";
import { prisma } from "@/lib/db";
import { FormPersonalSchema, TupdateProfileSchema } from "@/schemas/profile";
import { FormUsername } from "@/schemas/auth";
import { TServerPrompt } from "@/types";
import { deleteUploadedFile } from "./delete-upload";

export const completeProfile = async ({
  ...data
}: FormPersonalSchema): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        angkatan: data.angkatan,
        fakultas: data.fakultas,
        jenisKelamin: data.jenisKelamin,
        jurusan: data.jurusan,
        statusPelajar: data.statusPelajar,
        tanggalLahir: data.tanggalLahir,
        noTelephone: data.telpon,
        username: data.username,
      },
    });

    return {
      message: "Berhasil Memperbarui Profile",
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error({ error });
    return {
      error: "ada masalah di server mohon segera hubungi admin atau tulis pesan di umpan balik",
      success: false,
    };
  }
};

export const updateProfile = async ({
  noSiswa,
  username,
  Bio,
  alamat,
  jenisKelamin,
  telpon,
  tanggalLahir,
  fileKey,
  angkatan,
  jurusan,
  statusPelajar,
  fakultas,
}: TupdateProfileSchema): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  try {
    const oldUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { image: true },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        angkatan,
        jurusan,
        image: fileKey,
        username,
        alamat,
        bio: Bio,
        jenisKelamin,
        noTelephone: telpon,
        nomorSiswa: noSiswa,
        tanggalLahir,
        statusPelajar,
        fakultas,
      },
    });

    if (oldUser?.image && oldUser.image !== fileKey && fileKey) {
      await deleteUploadedFile(oldUser.image);
    }

    return {
      success: true,
      data: undefined,
      message: "berhasil update profile",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "masalah pada server update profile, hubungi admin ppi bartin",
    };
  }
};

export const postUsername = async ({
  username,
}: FormUsername): Promise<TServerPrompt> => {
  const session = await studentAccount();

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
    });
    return {
      success: true,
      data: undefined,
      message: `anda terdaftar sebagai ${username}`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "masalah pada server post username",
    };
  }
};
