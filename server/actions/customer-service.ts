"use server";

import { prisma } from "@/lib/db";
import { TcustomerServiceSchema } from "@/schemas";
import { TServerPrompt } from "@/types";
import { studentAccount } from "./account";
import { sendPushToRole } from "@/lib/push/server";

export const customerService = async ({
  catagory,
  level,
  message,
  subject,
  fileKeys,
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
        files: fileKeys && fileKeys.length > 0
          ? {
              create: fileKeys.map((key) => ({
                fileKey: key,
                fileUrl: `https://d9i7wgmc1q.ufs.sh/f/${key}`,
              })),
            }
          : undefined,
      },
    });

    await sendPushToRole({
      title: "Pesan Customer Service Baru",
      message: `${user.name || "Seseorang"} mengirim pesan: ${subject}`,
      url: "/home/profile/customer-service/list",
      roles: ["ADMIN", "PENGURUS"],
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
