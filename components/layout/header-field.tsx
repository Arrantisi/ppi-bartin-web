"use client";

import React from "react";
import { Button } from "../ui/button";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export const HeaderFieldLayout = ({
  children,
  label,
  href,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  return (
    <div className="mb-16 mx-3 mt-3">
      {/* header */}
      <div className="relative flex items-center justify-center my-6">
        <h1 className="title-tiga">{label}</h1>

        <Button
          variant={"outline"}
          onClick={() => router.push(href)}
          className="absolute left-0 top-0 rounded-full shadow-xl"
        >
          <IconArrowNarrowLeft />
        </Button>
      </div>
      {children}
    </div>
  );
};
