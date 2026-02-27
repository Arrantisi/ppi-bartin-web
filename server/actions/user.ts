"use server";

import { studentAccount } from "../actions/account";
import prisma from "@/lib/prisma";
import { FormUsername, TupdateProfileSchema } from "@/schemas";
import { TServerPrompt } from "@/types";

export const updateProfile = async ({
  noSiswa,
  username,
  Bio,
  alamat,
  jenisKelamin,
  telpon,
  tanggalLahir,
}: TupdateProfileSchema): Promise<TServerPrompt> => {
  const { user } = await studentAccount();

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        username,
        alamat,
        bio: Bio,
        jenisKelamin,
        noTelephone: telpon,
        nomorSiswa: noSiswa,
        tanggalLahir,
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
