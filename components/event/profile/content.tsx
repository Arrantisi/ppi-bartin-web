"use client";

import { cn } from "@/lib/utils";
import {
  Resolved,
  ThemeSelection,
  ThemeToggler,
} from "@/components/animate-ui/primitives/effects/theme-toggler";
import { Separator } from "@/components/ui/separator";
import { IconArrowRight } from "@/icons";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconAlertSquareRounded,
  IconBell,
  IconFileText,
  IconSun,
  IconWorld,
} from "@tabler/icons-react";

export const ContentProfile = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="space-y-3 my-3">
      <h1 className="title-tiga">Setting</h1>
      <div className="space-y-3 py-4 px-2 shadow-2xl rounded-2xl">
        <Link
          href={`/home/profile/update`}
          className="flex items-center justify-between px-5"
        >
          <div className="flex items-center gap-3">
            <IconFileText stroke={1.2} />
            <p className="content-description">Edit Profile</p>
          </div>
          <IconArrowRight />
        </Link>
        <Separator className="w-full mx-0" />
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <IconWorld stroke={1.2} />
            <p className="content-description">Bahasa</p>
          </div>
          <IconArrowRight />
        </div>
        <Separator className="w-full mx-0" />
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <IconBell stroke={1.2} />
            <p className="content-description">Notifikasi</p>
          </div>
          <IconArrowRight />
        </div>
        <Separator className="w-full mx-0" />
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <IconSun stroke={1.2} />
            <p className="content-description">Tema</p>
          </div>
          <ThemeToggler
            theme={theme as ThemeSelection}
            resolvedTheme={resolvedTheme as Resolved}
            setTheme={setTheme}
          >
            {({ effective, toggleTheme }) => {
              const nextTheme = effective === "dark" ? "light" : "dark";

              return (
                <Button
                  size={"icon-xs"}
                  variant={"outline"}
                  onClick={() => toggleTheme(nextTheme)}
                  className="relative rounded-xl"
                >
                  <SunIcon
                    strokeWidth={2}
                    className={cn(
                      "size-5 transition-all duration-300",
                      effective === "light"
                        ? "scale-100 rotate-0 opacity-100"
                        : "scale-0 -rotate-90 opacity-0",
                    )}
                  />
                  <MoonIcon
                    strokeWidth={2}
                    className={cn(
                      "absolute size-5 transition-all duration-300",
                      effective === "dark"
                        ? "scale-100 rotate-0 opacity-100"
                        : "scale-0 rotate-90 opacity-0",
                    )}
                  />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              );
            }}
          </ThemeToggler>
        </div>
        <Separator className="w-full mx-0" />
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <IconAlertSquareRounded stroke={1.2} />
            <p className="content-description">Syarat & Ketentuan</p>
          </div>
          <IconArrowRight />
        </div>
      </div>
    </div>
  );
};
