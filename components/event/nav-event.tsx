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
    { title: "Home", icon: IconSmartHome, url: "/home" },
    { title: "Events", icon: IconCalendarWeek, url: "/home/events" },
    { title: "News", icon: IconNews, url: "/home/news" },
    { title: "profile", icon: IconUser, url: "/home/profile" },
  ];

  const params = usePathname();

  return (
    <div
      className={`fixed w-full bottom-1 left-0 flex items-center justify-center p-2 z-50 ${!show && "hidden"}`}
    >
      <div className="flex items-center justify-between bg-card rounded-full p-1 shadow-2xl gap-6">
        {eventProps.map((e) => (
          <Link
            href={e.url}
            key={e.title}
            className={cn(
              "flex items-center p-2 rounded-full",
              e.url === params ? "bg-primary text-background gap-1" : "",
            )}
          >
            <e.icon className="size-5" />
            <span
              className={`text-xs ${e.url === params ? "block" : "hidden"}`}
            >
              {e.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavMainEvent;
