"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import NavigationEvent from "./navigation";
import { RightCardEvent } from "./right-card";
import { IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const LayoutEventComponent = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className=" relative">
        <div className="fixed bg-background h-10 w-full z-10 top-0 flex justify-between items-center px-2.5 py-6">
          <Link href={"/"}>
            <Image
              src={"/vercel.svg"}
              alt="vercel"
              height={20}
              width={20}
              className="size-7"
            />
          </Link>
          <h1 className="font-bold text-xl">BARTINDO</h1>
          <IconPlus className="size-7" />
        </div>
        {children}
        <div>
          <NavigationEvent />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <div className="fixed left-0 w-full max-w-[200px]">
        <NavigationEvent />
      </div>
      <div className="ml-52 max-w-5xl grid grid-cols-3 gap-3">
        {children}
        <div className="col-span-1 my-6">
          <RightCardEvent />
        </div>
      </div>
    </div>
  );
};

export default LayoutEventComponent;
