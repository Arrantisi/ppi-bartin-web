"use client";

import Image from "next/image";
import {
  IconArrowLeft,
  IconBookmark,
  IconCalendarWeek,
  IconMapPin,
  IconShare,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AvatarParticipant from "../avatar-participant";
import { CardEventProps } from "@/types";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import DrawerAcara from "../drawer-acara";
import { useState } from "react";

const EventDetail = ({
  createdBy,
  description,
  image,
  judul,
  lokasi,
  participant,
  tanggal,
  totalParticipant,
}: CardEventProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative flex flex-col h-screen bg-background overflow-hidden">
        {/* Gambar & Header Sticky */}
        <div className="relative h-[40vh] w-full">
          <Image
            src={image}
            alt={judul}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between z-10">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-md bg-white/80 backdrop-blur-sm"
              onClick={() => router.back()}
            >
              <IconArrowLeft size={20} />
            </Button>

            <span className="text-white font-bold text-lg drop-shadow-md">
              Acara
            </span>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-md bg-white/80 backdrop-blur-sm"
              >
                <IconShare size={20} />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-md bg-white/80 backdrop-blur-sm"
              >
                <IconBookmark size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Konten Detail */}
        <div className="flex-1 bg-background -mt-8 relative z-20 rounded-t-[2.5rem] px-6 pt-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{judul}</h1>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Oleh{" "}
                <span className="font-medium text-foreground">{createdBy}</span>
              </p>
              <AvatarParticipant
                participant={participant}
                totalParticipant={totalParticipant}
              />
            </div>

            <div className="prose prose-sm text-muted-foreground mb-8">
              <p>{description}</p>
            </div>

            {/* Info Waktu & Tempat */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <IconCalendarWeek size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    Sabtu, {tanggal}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    09.00 - 15.00 TRT
                  </span>
                  <button className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1 hover:underline">
                    Add to Calendar
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <IconMapPin size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{lokasi}</span>
                  <span className="text-xs text-muted-foreground">
                    Bartın Üniversitesi Kutlubey Kampüsü
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pb-8 mt-auto">
            <DrawerTrigger asChild>
              <Button className="w-full rounded-full py-7 text-base font-semibold shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">
                Daftar Sekarang
              </Button>
            </DrawerTrigger>
          </div>
        </div>
      </div>

      {/* Konten Drawer */}
      <DrawerAcara onClose={() => setIsOpen(false)} />
    </Drawer>
  );
};

export default EventDetail;
