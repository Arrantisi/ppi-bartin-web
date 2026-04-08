/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import webpush from "web-push";
import prisma from "@/lib/prisma";

// Konfigurasi VAPID
webpush.setVapidDetails(
  "mailto:yasin.arran@gmail.com", // Ganti dengan email admin
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(req: Request) {
  try {
    const { title, message, url } = await req.json();

    // 1. Ambil SEMUA subscription dari database Prisma
    const subscriptions = await prisma.notificationSubscription.findMany();

    if (subscriptions.length === 0) {
      return NextResponse.json({ message: "Tidak ada user yang terdaftar" });
    }

    // 2. Kirim ke setiap perangkat
    const notifications = subscriptions.map((sub) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth,
          p256dh: sub.p256dh,
        },
      };

      const payload = JSON.stringify({
        title: title || "Info PPI Bartin",
        body: message || "Ada kabar terbaru untukmu!",
        url: url || "/home",
      });

      return webpush
        .sendNotification(pushConfig, payload)
        .catch(async (error: any) => {
          // Jika token sudah tidak valid (user uninstalled), hapus dari DB
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.notificationSubscription.delete({
              where: { endpoint: sub.endpoint },
            });
          }
        });
    });

    await Promise.all(notifications);

    return NextResponse.json({ success: true, count: subscriptions.length });
  } catch (error: any) {
    console.error("Gagal kirim notif:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
