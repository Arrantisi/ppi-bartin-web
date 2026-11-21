"use client";

import Image from "next/image";
import Link from "next/link";
import type { TgetProfileUser } from "@/server/data/users";
import { IconBintangProfile } from "@/icons";

type Props = {
  user: NonNullable<TgetProfileUser>;
};

export const HeaderBand = ({ user }: Props) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 pb-6 border-b border-border">
      <div className="relative size-20 shrink-0 mx-auto md:mx-0">
        <Image
          src={user.image || "/default-avatar.png"}
          alt={user.name || ""}
          height={160}
          width={160}
          className="size-20 rounded-full object-cover"
        />
        <span className="absolute bottom-0.5 right-0.5 size-3.5 bg-green-500 border-[2.5px] border-bg rounded-full" />
      </div>

      <div className="flex flex-col items-center md:items-start gap-2 flex-1 min-w-0">
        <h1 className="title-satu text-center md:text-left truncate w-full">
          {user.name}
        </h1>
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <span>@{user.username}</span>
          <span className="text-text-disabled">·</span>
          <span className="truncate">
            {user.fakultas || "Bartın Üniversitesi"}
          </span>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-hover text-text-primary text-xs font-medium px-3 py-1">
            <IconBintangProfile />
            Anggota PPI Bartın
          </span>
          <span className="inline-flex items-center rounded-full bg-surface-hover text-text-primary text-xs font-medium px-3 py-1">
            Aktif 2026
          </span>
          {user.statusPelajar && (
            <span className="inline-flex items-center rounded-full bg-surface-hover text-text-primary text-xs font-medium px-3 py-1">
              {user.statusPelajar}
            </span>
          )}
        </div>
      </div>

      <Link
        href="/home/profile/update"
        className="shrink-0 self-center md:self-start inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover transition-colors"
      >
        Edit profil
      </Link>
    </div>
  );
};
