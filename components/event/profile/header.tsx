"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const HeaderProfile = () => {
  const router = useRouter();

  const signout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.refresh(),
      },
    });
  };

  return (
    <div className="flex justify-between">
      {/* title */}
      <h1 className="title-satu">Profile</h1>
      {/* logOut */}
      <button
        onClick={() => signout()}
        className="text-[16px] leading-[21px] tracking-[-0,31px] rounded-2xl px-2 text-destructive capitalize hover:bg-destructive/10 hover:ring active:bg-destructive/20 active:ring ring-destructive "
      >
        logout
      </button>
    </div>
  );
};
