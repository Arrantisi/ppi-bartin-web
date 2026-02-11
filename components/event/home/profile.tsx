import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconBell } from "@tabler/icons-react";
import React from "react";

const ProfileHome = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarImage src={"/user-profile-01.png"} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-muted-foreground text-sm">Halo, Bilal Alfa</h3>
          <h1 className="font-semibold text-lg tracking-tight">
            Selamat Datang!
          </h1>
        </div>
      </div>
      <div className="bg-white rounded-full shadow-xl p-1.5 mx-2">
        <IconBell className="size-5" />
      </div>
    </div>
  );
};

export default ProfileHome;
