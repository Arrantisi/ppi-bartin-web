"use server";

import { studentAccount } from "@/lib/account";
import prisma from "@/lib/prisma";
import { FormUsername } from "@/schemas";
import { TServerPrompt } from "@/types";

export const getProfileUser = async () => {
  const session = await studentAccount();
  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true, username: true },
  });
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
      msg: "masalah pada server join acara",
    };
  }
};
