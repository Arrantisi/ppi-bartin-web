import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

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
      <Link href={"/"}>
        <Avatar className=" bg-white rounded-full shadow-xl p-1.5 mx-2 flex items-center justify-center">
          <AvatarImage src={"/logo-ppi-bartin.png"} />
        </Avatar>
      </Link>
    </div>
  );
};

export default ProfileHome;
