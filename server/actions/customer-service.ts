"use server";

import { prisma } from "@/lib/db";
import { TcustomerServiceSchema } from "@/schemas/customer-service";
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
    let user;
    try {
      const session = await studentAccount();
      user = session.user;
    } catch {
      return { error: "kamu harus login", success: false };
    }

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
      message: "pesan kamu telah di kirim",
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "maaf ada kendala",
      success: false,
    };
  }
};
