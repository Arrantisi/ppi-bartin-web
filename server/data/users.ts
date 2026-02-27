"use server";

import { headers } from "next/headers";
import { studentAccount } from "../actions/account";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const userSession = async () => {
  return await auth.api.getSession({ headers: await headers() });
};

export const getProfileUser = async () => {
  const session = await studentAccount();
  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      name: true,
      nomorSiswa: true,
      email: true,
      image: true,
      alamat: true,
      bio: true,
      noTelephone: true,
      jenisKelamin: true,
      tanggalLahir: true,
    },
  });
};
export type TgetProfileUser = Awaited<ReturnType<typeof getProfileUser>>;

export const userData = async () => {
  return await prisma.user.findMany({
    orderBy: {
      name: "desc",
    },
    select: {
      id: true,
      name: true,
      nomorSiswa: true,
      email: true,
      image: true,
      alamat: true,
      bio: true,
      noTelephone: true,
      jenisKelamin: true,
      tanggalLahir: true,
    },
  });
};

export type UserData = Awaited<ReturnType<typeof userData>>[0];

export const checkNoSiswa = async () => {
  const session = await studentAccount();

  return await prisma.user.findUnique({ where: { id: session.user.id } });
};

export const dataSiswa = async () => {
  return await prisma.dataSiswa.findMany({
    orderBy: {
      nama_siswa: "desc",
    },
  });
};
