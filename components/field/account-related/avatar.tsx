import { Avatar, AvatarImage, AvatarIndicator } from "@/components/ui/avatar";
import { TgetProfileUser } from "@/server/data/users";
import { IconCamera } from "@tabler/icons-react";

export const AvatarUpdateProfile = ({ ...props }: TgetProfileUser) => {
  return (
    <div className="flex items-center flex-col space-y-3 my-5">
      <div className="p-1 rounded-full border border-border bg-surface">
        <Avatar className="size-[120px]">
          <AvatarImage src={props.image || ""} />
          <AvatarIndicator className="bg-surface-hover rounded-full text-text-primary size-[36px] top-[80px] left-[80px] border border-border">
            <IconCamera size={20} />
          </AvatarIndicator>
        </Avatar>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="footnote text-text-secondary">
          Tap untuk ganti foto profil
        </h3>
        <p className="footnote text-text-disabled">
          JPG, PNG (Max 4MB)
        </p>
      </div>
    </div>
  );
};
