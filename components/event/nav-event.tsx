"use client";

import { cn } from "@/lib/utils";
import {
  Icon,
  IconCalendarWeek,
  IconNews,
  IconSmartHome,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type EventProps = {
  title: string;
  icon: Icon;
  url: string;
}[];

const NavMainEvent = ({ show = true }: { show?: boolean }) => {
  const eventProps: EventProps = [
    { title: "Beranda", icon: IconSmartHome, url: "/home" },
    { title: "Kegiatan", icon: IconCalendarWeek, url: "/home/events" },
    { title: "Berita", icon: IconNews, url: "/home/news" },
    { title: "Profil", icon: IconUser, url: "/home/profile" },
  ];

  const params = usePathname();

  return (
    <div
      className={`fixed w-full bottom-0 left-0 flex items-center justify-center z-50 bg-card ${!show && "hidden"}`}
    >
      <div className="max-w-xl md:max-w-2xl xl:max-w-3xl flex items-center justify-between  px-6 pb-4 pt-0.5 shadow-2xl gap-[16px] w-full">
        {eventProps.map((e) => (
          <Link
            href={e.url}
            key={e.title}
            className={cn(
              "flex flex-col justify-center items-center p-2 min-w-[55px] m-1.5 dark:text-foreground text-foreground/40",
              e.url === params &&
                "text-primary bg-primary/20 dark:bg-primary/50 rounded-2xl",
            )}
          >
            <e.icon className="size-5" />
            <span className={cn("text-xs")}>{e.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavMainEvent;
