"use client";

import { authClient } from "@/lib/auth/client";
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
        className="title-tiga rounded-xl px-2 text-danger capitalize hover:bg-danger/10 active:bg-danger/20"
      >
        logout
      </button>
    </div>
  );
};
