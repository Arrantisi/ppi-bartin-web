"use client";

import { useMemo } from "react";
import Link from "next/link";
import { IconCalendarPlus, IconNews } from "@tabler/icons-react";

import { buttonVariants } from "@/components/ui/button";
import { useProfileUser } from "@/hooks/use-users";

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
};

const ProfileHome = () => {
  const { data: session } = useProfileUser();
  const displayName = session?.name || session?.username || "Pengguna";
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-accent-subtle p-6 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full border border-border/60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 right-24 size-80 rounded-full border border-border/40"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-accent">
            {greeting()}
          </p>
          <h1 className="title-satu text-text-primary capitalize">
            Halo, {displayName}
          </h1>
          <p
            suppressHydrationWarning
            className="body text-text-secondary first-letter:capitalize"
          >
            {today}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/home/acara/create"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <IconCalendarPlus aria-hidden />
            Lihat acara
          </Link>
          <Link
            href="/home/berita"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <IconNews aria-hidden />
            Lihat Berita
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProfileHome;
