// lib/send-push.ts
import webpush from "web-push";
import prisma from "@/lib/prisma";
import { studentAccount } from "@/server/actions/account";

export async function sendPushToAll({
  message,
  title,
  url,
}: {
  title: string;
  message: string;
  url: string;
}) {
  const { user } = await studentAccount();

  // 1. Inisialisasi VAPID
  webpush.setVapidDetails(
    "mailto:admin@ppibartin.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );

  // 2. Ambil semua token dari database
  const subscriptions = await prisma.notificationSubscription.findMany({
    where: { userId: { not: user.id } },
  });

  if (subscriptions.length === 0) {
    console.log("Tidak ada user yang berlangganan.");
    return { success: true, count: 0 };
  }

  // 3. Kirim secara paralel
  const notifications = subscriptions.map((sub) => {
    const pushConfig = {
      endpoint: sub.endpoint,
      keys: {
        auth: sub.auth,
        p256dh: sub.p256dh,
      },
    };

    const payload = JSON.stringify({
      title,
      body: message,
      url,
    });

    return webpush
      .sendNotification(pushConfig, payload)
      .catch(async (error) => {
        // Jika token mati (410 Gone), langsung hapus dari database agar bersih
        if (error.statusCode === 410 || error.statusCode === 404) {
          await prisma.notificationSubscription.delete({
            where: { endpoint: sub.endpoint },
          });
        }
      });
  });

  await Promise.all(notifications);
  return { success: true, count: subscriptions.length };
}
