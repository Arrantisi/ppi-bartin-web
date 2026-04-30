"use server";

import { studentAccount } from "../actions/account";
import prisma from "@/lib/prisma";
import {
  FormPersonalSchema,
  FormUsername,
  TupdateProfileSchema,
} from "@/schemas";
import { TServerPrompt } from "@/types";

export const compliteProfile = async ({
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
      msg: "Berhasil Memperbarui Profile",
      status: "success",
    };
  } catch (error) {
    console.error({ error });
    return {
      msg: "ada masalah di server mohon segera hubungi admin atau tulis pesan di umpan balik",
      status: "error",
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

    return {
      status: "success",
      msg: "berhasil update profile",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server update profile, hubungi admin ppi bartin",
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
      status: "success",
      msg: "kamu sudah berhasil join acara",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "masalah pada server post username",
    };
  }
};
