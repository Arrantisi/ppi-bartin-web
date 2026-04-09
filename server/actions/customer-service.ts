"use server";

import prisma from "@/lib/prisma";
import { TcustomerServiceSchema } from "@/schemas";
import { TServerPrompt } from "@/types";

export const customerService = async ({
  catagory,
  level,
  message,
  subject,
}: TcustomerServiceSchema): Promise<TServerPrompt> => {
  try {
    await prisma.customerService.create({
      data: {
        catagory,
        level,
        message,
        status: "PENDING",
        subject,
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
