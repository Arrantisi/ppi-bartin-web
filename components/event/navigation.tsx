"use client";

import {
  Icon,
  IconCalendarWeek,
  IconHomeFilled,
  IconMenu2,
  IconPlus,
  IconSearch,
  IconUserCircle,
} from "@tabler/icons-react";
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from "../animate-ui/components/base/tooltip";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

type TNavProps = {
  navMain: {
    id: number;
    icon: Icon;
    title: string;
    link: string;
  }[];
  navFooter: {
    icon: Icon;
    title: string;
    link: string;
  }[];
};

const navProps: TNavProps = {
  navMain: [
    {
      id: 64,
      icon: IconHomeFilled,
      title: "Event",
      link: "/events",
    },
    {
      id: 72,
      icon: IconSearch,
      title: "Search",
      link: "events/search",
    },
    {
      id: 78,
      icon: IconCalendarWeek,
      title: "Calender",
      link: "",
    },
    {
      id: 36,
      icon: IconPlus,
      title: "Create",
      link: "",
    },

    {
      id: 17,
      icon: IconUserCircle,
      title: "Profile",
      link: "",
    },
  ],
  navFooter: [
    {
      icon: IconMenu2,
      title: "more",
      link: "",
    },
  ],
};

const NavigationEvent = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-screen m-5 relative flex flex-col justify-between items-start">
      {isMobile ? (
        <ul className="fixed bottom-0 h-15 w-full bg-background flex justify-between items-start px-5 border-t left-0">
          {navProps.navMain.map((nav) => (
            <Link key={nav.id} href={nav.link}>
              <li>
                <nav.icon className="size-7 my-3 font-bold" />
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          <Link href={"/"}>
            <Image
              src={"/vercel.svg"}
              alt="vercel"
              height={20}
              width={20}
              className="size-7"
            />
          </Link>
          <ul>
            {navProps.navMain.map((nav) => (
              <li key={nav.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <nav.icon className="size-7 my-3 font-bold" />
                  </TooltipTrigger>
                  <TooltipPanel side="right">{nav.title}</TooltipPanel>
                </Tooltip>
              </li>
            ))}
          </ul>
          <div className="mb-10">
            <ul>
              {navProps.navFooter.map((nav) => (
                <li key={nav.title}>
                  <Tooltip>
                    <TooltipTrigger>
                      <nav.icon className="size-7 my-3 font-bold" />
                    </TooltipTrigger>
                    <TooltipPanel side="right">{nav.title}</TooltipPanel>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationEvent;
