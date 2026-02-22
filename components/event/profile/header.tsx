"use client";

import { HeaderProfileSkeleton } from "@/components/skeletons/header-profile-skeleton";
import { goeyToast, GoeyToaster } from "@/components/ui/goey-toaster";
import { getProfileUser } from "@/server/actions/user";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export const HeaderProfile = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["getProfile"],
    queryFn: () => getProfileUser(),
  });

  if (isLoading) {
    return <HeaderProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <Image
        src={user.image || ""}
        alt=""
        width={20}
        height={20}
        className="size-18 rounded-full my-2
        "
      />

      <div className="font-semibold text-lg tracking-wide">{user.name}</div>
      <button
        onClick={() =>
          goeyToast.info("copy nomor siswa", {
            description: "nomor siswa telah di generate",
            action: {
              label: "Copy nomor siswa",
              onClick: () =>
                navigator.clipboard.writeText(user.nomorSiswa || ""),
              successLabel: "Nomor siswa telah di copy",
            },
          })
        }
        className=""
      >
        {user.nomorSiswa}
      </button>
    </div>
  );
};
