"use client";

import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export const UpdateEventHeader = () => {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-center my-5">
      <Button
        onClick={() => router.push("/home/events")}
        variant={"outline"}
        className="absolute left-2 rounded-full border-none"
      >
        <IconArrowLeft />
      </Button>
      <h1 className="title-tiga">Update Acara</h1>
    </div>
  );
};
