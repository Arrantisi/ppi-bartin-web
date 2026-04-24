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
import { joinEvent } from "@/server/actions/acara";
import { Spinner } from "../ui/spinner";
import { useState } from "react";
import { toast } from "sonner";

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
    setOnLoading(true);
    try {
      const fetch = await joinEvent(eventId);
      if (fetch.status === "error") {
        toast.error(`maaf ${fetch.msg}`);
      } else {
        toast.success("Selamat, kamu sudah join event");
        // Kasih delay kecil sebelum tutup agar state loading terlihat dan transisi mulus
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOnLoading(false);
    }
  };

  return (
    <DrawerContent className="rounded-t-4xl fixed bottom-0 left-0 right-0">
      <DrawerHeader>
        <DrawerTitle>browser acara</DrawerTitle>
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
