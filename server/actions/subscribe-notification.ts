"use server";

import { prisma } from "@/lib/db";
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

export async function getUserPushSubscriptions() {
  const { user } = await studentAccount();

  const count = await prisma.notificationSubscription.count({
    where: { userId: user.id },
  });

  return { hasSubscription: count > 0 };
}

export async function deleteUserPushSubscriptions() {
  const { user } = await studentAccount();

  await prisma.notificationSubscription.deleteMany({
    where: { userId: user.id },
  });

  return { success: true };
}
