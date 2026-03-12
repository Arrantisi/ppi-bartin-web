"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileUser } from "@/hooks/use-users";
import Image from "next/image";
import Link from "next/link";

const ProfileHome = () => {
  const { data: session } = useProfileUser();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarImage src={session?.image || ""} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-muted-foreground text-sm capitalize">
            Halo, {session?.username}
          </h3>
          <h1 className="font-semibold text-lg tracking-tight">
            Selamat Datang!
          </h1>
        </div>
      </div>
      <Link href={"/"}>
        <div className=" bg-white rounded-full shadow-xl p-1.5 mx-2 flex items-center justify-center">
          <Image
            src={"/logo-ppi.png"}
            alt=""
            width={200}
            height={200}
            className="size-6"
          />
        </div>
      </Link>
    </div>
  );
};

export default ProfileHome;
