"use client";

import { HeaderProfileSkeleton } from "@/components/skeletons/header-profile-skeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconBintangProfile } from "@/icons";
import { getProfileUser } from "@/server/data/users";
import { useQuery } from "@tanstack/react-query";

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
    <div className="flex items-center justify-center flex-col space-y-3">
      <Avatar className="size-[120px]">
        <AvatarImage src={user.image || ""} />
      </Avatar>
      <div className="title-tiga">{user.name}</div>
      <Badge className="bg-[#FFD700] text-black rounded-full px-2">
        <IconBintangProfile /> Anggota PPI
      </Badge>
    </div>
  );
};
