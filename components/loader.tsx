import React from "react";
import { LoaderOne } from "@/components/ui/loader";
import Image from "next/image";

export function LoaderOneDemo() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col items-center pb-10">
        <Image src={"/logo-ppi.png"} alt="" height={130} width={130} />
        <LoaderOne />
      </div>
    </div>
  );
}
