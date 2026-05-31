import { Avatar, AvatarImage, AvatarIndicator } from "@/components/ui/avatar";
import { TgetProfileUser } from "@/server/data/users";
import { IconCamera } from "@tabler/icons-react";

export const AvatarUpdateProfile = ({ ...props }: TgetProfileUser) => {
  return (
    <div className="flex items-center flex-col space-y-3 my-5">
      <div className="shadow-2xl p-1 rounded-full">
        <Avatar className="size-[120px]">
          <AvatarImage src={props.image || ""} />
          <AvatarIndicator className="shadow bg-blue-600 rounded-full text-background size-[36px] top-[80px] left-[80px]">
            <IconCamera size={20} />
          </AvatarIndicator>
        </Avatar>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-[13px] leading-[19.5px] text-foreground/60 ">
          Tap untuk ganti foto profil
        </h3>
        <p className="text-[12px] leading-[18px] text-foreground/40 ">
          JPG, PNG (Max 4MB)
        </p>
      </div>
    </div>
  );
};
