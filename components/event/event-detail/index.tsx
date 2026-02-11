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
  const router = useRouter();

  return (
    <div className="relative h-screen overflow-x-hidden">
      <div>
        <Image
          src={image}
          alt=""
          height={150}
          width={200}
          className="w-full max-h-[600px] object-cover"
        />
        <div className="absolute grid grid-cols-5 top-1 my-1 mx-2 w-full items-center">
          <div className="col-span-2">
            <Button
              variant={"ghost"}
              className="bg-background rounded-full text-black"
              onClick={() => router.back()}
            >
              <IconArrowLeft />
            </Button>
          </div>
          <div className="col-span-1 text-background font-semibold text-2xl">
            Acara
          </div>
          <div className="col-span-2 flex items-center justify-end mr-4 gap-2">
            <Button
              variant={"ghost"}
              className="bg-background rounded-full text-black"
            >
              <IconShare />
            </Button>
            <Button
              variant={"ghost"}
              className="bg-background rounded-full text-black"
            >
              <IconBookmark />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between bg-background max-h-[600px] min-h-[500px] w-full bottom-0 absolute rounded-t-4xl pt-4 px-2">
        <div>
          <h1 className="judul-card-event">{judul}</h1>
          <div className="flex items-center justify-between">
            <h3 className="subtitle-card-event">Created by {createdBy}</h3>
            <AvatarParticipant
              participant={participant}
              totalParticipant={totalParticipant}
            />
          </div>
          <p className="description-card-event mt-4">{description}</p>
        </div>

        <div className="">
          <div className="flex items-center gap-3">
            <IconCalendarWeek />
            <div className="flex flex-col items-start">
              <span className="tanggal-card-event">Sabtu, {tanggal}</span>
              <span className="description-card-event">09.00 - 15.00 TRT</span>
            </div>
          </div>
          <span className="text-xs text-primary ml-9">add to calender</span>
          <div className="flex items-center gap-3 mb-10">
            <IconMapPin />
            <div className="flex flex-col items-start">
              <span className="tanggal-card-event">{lokasi}</span>
              <span className="description-card-event">
                Bartın Üniversitesi Kutlubey Kampüsü
              </span>
            </div>
          </div>
          <Button className="w-full rounded-full mb-5 py-6 text-sm">
            Daftar Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
