"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileUser } from "@/hooks/use-users";
import { IconBell } from "@tabler/icons-react";

const ProfileHome = () => {
  const { data: session } = useProfileUser();
  const displayName = session?.name || session?.username || "Pengguna";

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={session?.image || ""} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-px">
          <h3 className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-text-primary capitalize">
            Halo, {displayName}
          </h3>
          <h1 className="text-[0.8125rem] font-normal text-text-disabled">
            Selamat datang
          </h1>
        </div>
      </div>
      <button
        type="button"
        aria-label="Notifikasi"
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-text-disabled transition-colors hover:bg-surface-hover hover:text-text-primary"
      >
        <IconBell className="size-5" />
      </button>
    </div>
  );
};

export default ProfileHome;

