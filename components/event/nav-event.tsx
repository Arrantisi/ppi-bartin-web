"use client";

import {
  Icon,
  IconCalendarWeek,
  IconHome,
  IconPencilPlus,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type EventProps = {
  title: string;
  icon: Icon;
  url: string;
}[];

const NavMainEvent = () => {
  const eventProps: EventProps = [
    { title: "Home", icon: IconHome, url: "/events" },
    { title: "Acara", icon: IconCalendarWeek, url: "/events/acara" },
    { title: "Berita", icon: IconPencilPlus, url: "/events/berita" },
    { title: "profile", icon: IconUser, url: "/events/profile" },
  ];

  const params = usePathname();

  return (
    <div className="fixed w-full bottom-1 left-0 flex items-center justify-center p-3 z-5">
      <div className=" flex items-center justify-between backdrop-blur-xl bg-black/5 rounded-full p-4 shadow-2xl">
        {eventProps.map((e) => (
          <Link
            href={e.url}
            key={e.title}
            className="flex items-center p-3 rounded-full bg-primary mx-3 text-white gap-1  transition-all duration-300"
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
