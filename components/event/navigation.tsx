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

type TNavProps = {
  navMain: {
    id: number;
    icon: Icon;
    title: string;
  }[];
  navFooter: {
    icon: Icon;
    title: string;
  }[];
};

const navProps: TNavProps = {
  navMain: [
    {
      id: 64,
      icon: IconHomeFilled,
      title: "Event",
    },
    {
      id: 72,
      icon: IconSearch,
      title: "Calender",
    },
    {
      id: 78,
      icon: IconCalendarWeek,
      title: "Search",
    },
    {
      id: 36,
      icon: IconPlus,
      title: "Create",
    },

    {
      id: 17,
      icon: IconUserCircle,
      title: "Profile",
    },
  ],
  navFooter: [
    {
      icon: IconMenu2,
      title: "more",
    },
  ],
};

const NavigationEvent = () => {
  return (
    <div className="w-full h-screen m-5 relative flex flex-col justify-between items-start">
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
      </div>
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
  );
};

export default NavigationEvent;
