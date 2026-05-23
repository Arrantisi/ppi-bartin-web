"use client";

import { useProfileUser } from "@/hooks/use-users";
import { getGreeting } from "@/utils/get-greeting";

const ProfileHome = () => {
  const { data: session } = useProfileUser();

  const salam = getGreeting();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 p-4 md:p-0">
          {/* Sapaan Utama */}
          <h3 className="text-foreground text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            {salam}, <br className="sm:hidden" />{" "}
            {/* Baris baru hanya di mobile agar tidak sesak */}
            <span className="bg-linear-to-r from-secondary to-primary-500 bg-clip-text text-transparent">
              {session?.username || "Rekan"}
            </span>{" "}
            👋
          </h3>

          {/* Sub-header / Deskripsi */}
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base font-medium leading-snug">
            Selamat datang di{" "}
            <span className="text-foreground border-b-2 border-secondary/30">
              Portal PPI Bartın
            </span>
            . Sudahkah kamu cek agenda hari ini?
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHome;
