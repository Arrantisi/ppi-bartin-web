"use server";

import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const studentAccount = cache(async () => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user) throw new Error("Unauthorized");

  return user;
});

export const getCurrentUserRole = cache(async (): Promise<string> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return "USER";
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    return user?.role || "USER";
  } catch {
    return "USER";
  }
});


