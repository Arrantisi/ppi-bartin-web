"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { IconCalendarWeek, IconMapPin } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { CardEventProps } from "@/types";
import Link from "next/link";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import DrawerAcara from "./drawer-acara";
import { useState } from "react";

const CardEvent = ({
  id,
  slug,
  createdBy,
  description,
  image,
  judul,
  lokasi,
  tanggal,
}: CardEventProps) => {
  const [isOpen, setisOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setisOpen}>
      <Card className="py-2 shadow-2xl">
        <CardHeader className="px-2">
          <Image
            src={image}
            alt="card-event"
            height={200}
            width={200}
            className="w-full h-[300px] object-cover rounded-2xl"
          />
        </CardHeader>
        <CardContent className="px-3">
          <h1 className="judul-card-event">{judul}</h1>
          <div className="flex items-center justify-between mt-3">
            <h4 className="subtitle-card-event">
              created by <span className="capitalize">{createdBy}</span>
            </h4>
            <Link
              href={`/detail/event/${slug}`}
              className="text-xs text-primary mr-3"
            >
              Lebih Detail
            </Link>
          </div>
          <div className="flex items-center text-muted-foreground/80 my-3 gap-5">
            <div className="flex items-center gap-1.5">
              <IconCalendarWeek className="size-4 " />
              <span className="text-xs font-semibold">Sabtu, {tanggal}</span>
            </div>
            <div className="flex items-center gap-1.5 ">
              <IconMapPin className="size-4 " />
              <span className="text-xs font-semibold">{lokasi}</span>
            </div>
          </div>
          <p className="line-clamp-3 description-card-event">{description}</p>
        </CardContent>
        <CardFooter className="px-3 pb-3 justify-between">
          {/* <AvatarParticipant
            participant={participant}
            totalParticipant={totalParticipant}
          /> */}
          <DrawerTrigger asChild>
            <Button className="rounded-full text-xs">Daftar Sekarang</Button>
          </DrawerTrigger>
        </CardFooter>
      </Card>
      <DrawerAcara
        onClose={() => setisOpen(false)}
        eventId={id}
        tanggal={""}
        lokasi={""}
      />
    </Drawer>
  );
};

export default CardEvent;
