import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Debug log untuk melihat apakah prisma terbaca
  console.log("Is Prisma Defined?", !!prisma);
  if (prisma) {
    console.log("Is Model Defined?", !!prisma.notificationSubscription);
  }

  try {
    const sub = await req.json();

    if (!prisma) {
      throw new Error("Objek Prisma tidak ditemukan. Cek file import!");
    }

    const savedSub = await prisma.notificationSubscription.upsert({
      where: { endpoint: sub.endpoint },
      update: {
        auth: sub.keys.auth,
        p256dh: sub.keys.p256dh,
      },
      create: {
        endpoint: sub.endpoint,
        auth: sub.keys.auth,
        p256dh: sub.keys.p256dh,
      },
    });

    return NextResponse.json({ success: true, data: savedSub });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error Detail:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
