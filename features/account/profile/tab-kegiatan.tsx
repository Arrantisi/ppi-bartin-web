"use client";

import type { TgetProfileUser } from "@/server/data/users";
import { IconCalendarOff } from "@tabler/icons-react";

type Props = {
  user: NonNullable<TgetProfileUser>;
};

export const TabKegiatan = ({ user }: Props) => {
  const today = new Date();

  if (!user.participants || user.participants.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center p-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface text-text-disabled">
          <IconCalendarOff className="size-10" />
        </div>
        <h3 className="mt-4 title-tiga text-text-primary">Belum Ada Kegiatan</h3>
        <p className="mt-2 body text-text-secondary max-w-xs">
          Kamu belum mengikuti kegiatan apapun. Yuk ikuti kegiatan PPI Bartın!
        </p>
      </div>
    );
  }

  const sorted = [...user.participants].sort(
    (a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime()
  );

  return (
    <div className="mt-4">
      <div className="rounded-xl border border-border bg-card">
        {sorted.map((p, idx) => {
          const isPast = new Date(p.event.date) <= today;
          return (
            <div
              key={p.id}
              className={`flex items-center gap-4 px-4 py-3.5 ${
                idx < sorted.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-primary font-medium truncate">
                  {p.event.judul}
                </p>
                <p className="text-xs text-text-secondary">
                  {new Date(p.event.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="shrink-0 text-xs text-text-disabled mono">
                {isPast ? "Selesai" : "Akan Datang"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
