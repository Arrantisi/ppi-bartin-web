import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconBell } from "@tabler/icons-react";

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
      <Avatar className=" bg-white rounded-full shadow-xl p-1.5 mx-2 flex items-center justify-center">
        <IconBell className="size-5" />
        <AvatarIndicator className="-end-1 -top-1">
          <Badge
            variant="primary"
            size="xs"
            shape="circle"
            className="border border-background"
          >
            6
          </Badge>
        </AvatarIndicator>
      </Avatar>
    </div>
  );
};

export default ProfileHome;
