"use server";

import prisma from "@/lib/prisma";
import { TcustomerServiceSchema } from "@/schemas";
import { TServerPrompt } from "@/types";
import { studentAccount } from "./account";

export const customerService = async ({
  catagory,
  level,
  message,
  subject,
}: TcustomerServiceSchema): Promise<TServerPrompt> => {
  try {
    const { user } = await studentAccount();

    await prisma.customerService.create({
      data: {
        catagory,
        level,
        message,
        status: "PENDING",
        subject,
        userId: user.id,
      },
    });

    return {
      msg: "pesan kamu telah di kirim",
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      msg: "maaf ada kendala",
      status: "error",
    };
  }
};
