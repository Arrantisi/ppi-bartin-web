"use client";

import { IconCalendarWeek, IconMapPin } from "@tabler/icons-react";
import { Button } from "../ui/button";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { joinEvent } from "@/actions/acara";
import { toastManager } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import { useState } from "react";

const DrawerAcara = ({
  onClose,
  tanggal,
  lokasi,
  eventId,
}: {
  onClose: () => void;
  eventId: string;
  tanggal: string;
  lokasi: string;
}) => {
  const [onLoading, setOnLoading] = useState(false);

  const handleJoinEvent = async () => {
    setOnLoading(false);
    const fetch = await joinEvent(eventId);
    if (fetch.status === "error") {
      toastManager.add({ type: "error", title: fetch.msg });
    } else if (fetch.status === "success") {
      toastManager.add({ type: "success", title: fetch.msg });
    }
    setOnLoading(false);
    onClose();
  };

  return (
    <DrawerContent className="rounded-t-4xl">
      <DrawerHeader>
        <DrawerTitle>DrawerAcara</DrawerTitle>
        <DrawerDescription asChild>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <IconCalendarWeek />
              <div className="flex flex-col items-start">
                <span className="tanggal-card-event">Tanggal</span>
                <span className="description-card-event">{tanggal}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconMapPin />
              <div className="flex flex-col items-start">
                <span className="tanggal-card-event capitalize">Lokasi</span>
                <span className="description-card-event">{lokasi}</span>
              </div>
            </div>
          </div>
        </DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button
          disabled={onLoading}
          className="w-full rounded-full mb-5 py-6 text-sm"
          onClick={handleJoinEvent}
        >
          {onLoading && <Spinner className="size-5" />} Daftar Sekarang
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
};

export default DrawerAcara;
