"use client";

import { HeaderProfileSkeleton } from "@/components/skeletons/header-profile-skeleton";
import { Badge } from "@/components/ui/badge";
import { IconBintangProfile } from "@/icons";
import { getProfileUser } from "@/server/data/users";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export const HeaderContentProfile = () => {
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
    <div className="flex items-center justify-center flex-col space-y-3 ">
      <Image
        src={user.image || ""}
        alt=""
        height={1000}
        width={1000}
        className="size-28 rounded-full"
      />
      <div className="title-tiga">{user.name}</div>
      <Badge className="bg-[#FFD700] text-black rounded-full px-2">
        <IconBintangProfile /> Anggota PPI Bartın
      </Badge>
    </div>
  );
};
