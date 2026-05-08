"use server";

import prisma from "@/lib/prisma";
import { studentAccount } from "@/server/actions/account";

export async function saveNotificationSubscription(sub: {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}) {
  const { user } = await studentAccount();

  if (!sub?.endpoint || !sub?.keys?.auth || !sub?.keys?.p256dh) {
    throw new Error("Data subscription tidak lengkap");
  }

  const savedSub = await prisma.notificationSubscription.upsert({
    where: { endpoint: sub.endpoint },
    update: {
      auth: sub.keys.auth,
      p256dh: sub.keys.p256dh,
      userId: user.id,
    },
    create: {
      endpoint: sub.endpoint,
      auth: sub.keys.auth,
      p256dh: sub.keys.p256dh,
      userId: user.id,
    },
  });

  return { success: true, data: savedSub };
}
