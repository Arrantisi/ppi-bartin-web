import prisma from "@/lib/prisma";
import { studentAccount } from "@/server/actions/account";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user } = await studentAccount();

    const sub = await req.json();

    if (!sub?.endpoint || !sub?.keys?.auth || !sub?.keys?.p256dh) {
      return NextResponse.json(
        { success: false, error: "Data subscription tidak lengkap" },
        { status: 400 },
      );
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
