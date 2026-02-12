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

const DrawerAcara = ({ onClose }: { onClose: () => void }) => {
  const handleDaftar = () => {
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
                <span className="tanggal-card-event">Sabtu,</span>
                <span className="description-card-event">
                  09.00 - 15.00 TRT
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconMapPin />
              <div className="flex flex-col items-start">
                <span className="tanggal-card-event capitalize">
                  aula campus
                </span>
                <span className="description-card-event">
                  Bartın Üniversitesi Kutlubey Kampüsü
                </span>
              </div>
            </div>
          </div>
        </DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button
          className="w-full rounded-full mb-5 py-6 text-sm"
          onClick={handleDaftar}
        >
          Daftar Sekarang
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
};

export default DrawerAcara;
