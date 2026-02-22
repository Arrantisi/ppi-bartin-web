"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const studentAccount = async () => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user) throw new Error("Unauthorized");

  return user;
};
