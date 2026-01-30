"use server";

import prisma from "./prisma";

export const checkNoSiswa = async (userId: string) => {
  return await prisma.user.findUnique({ where: { id: userId } });
};
