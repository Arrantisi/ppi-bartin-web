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
import AvatarParticipant from "./avatar-participant";
import { authClient } from "@/lib/auth-client";

const CardEvent = ({
  id,
  slug,
  createdBy,
  description,
  image,
  judul,
  lokasi,
  tanggal,
  participant,
  totalParticipant,
  maxCapacity,
}: CardEventProps) => {
  const [isOpen, setisOpen] = useState(false);

  const { data: session } = authClient.useSession();

  const userJoined = participant.find((user) => user.id === session?.user.id);
  const capacityFull = participant.length >= maxCapacity;

  return (
    <Drawer open={isOpen} onOpenChange={setisOpen}>
      <Card className="py-2 shadow-2xl">
        {image && (
          <CardHeader className={`px-2`}>
            <Image
              src={image}
              alt="card-event"
              height={200}
              width={200}
              className="w-full h-[300px] object-cover rounded-2xl"
            />
          </CardHeader>
        )}

        <CardContent className="px-3">
          <h1 className="judul-card-event">{judul}</h1>
          <div className="flex items-center justify-between mt-3">
            <h4 className="subtitle-card-event">
              created by <span className="capitalize">{createdBy}</span>
            </h4>
            <Link
              href={`/home/events/${slug}`}
              className="text-xs text-primary mr-3"
            >
              Lebih Detail
            </Link>
          </div>
          <div className="grid grid-cols-6 items-start text-muted-foreground/80 my-3">
            <div className=" col-span-2 flex items-start gap-1.5">
              <IconCalendarWeek className="size-4 " />
              <span className="text-xs font-semibold w-full">{tanggal}</span>
            </div>
            <div className="col-span-4 flex items-start gap-1.5">
              <IconMapPin className="size-4 " />
              <span className="text-xs font-semibold">{lokasi}</span>
            </div>
          </div>
          <p className="line-clamp-3 description-card-event">{description}</p>
        </CardContent>
        <CardFooter className="px-3 pb-3 justify-between">
          <AvatarParticipant
            maxCapacity={maxCapacity}
            participant={participant}
            totalParticipant={totalParticipant}
          />

          {capacityFull ? (
            <div className="text-xs font-semibold rounded-full capitalize bg-primary text-background py-2.5 px-3">
              sudah penuh{" "}
            </div>
          ) : userJoined?.id === session?.user.id ? (
            <div className="text-xs font-semibold rounded-full capitalize bg-primary text-background py-2.5 px-3">
              kamu telah join
            </div>
          ) : (
            <DrawerTrigger asChild>
              <Button className="rounded-full text-xs">Daftar Sekarang</Button>
            </DrawerTrigger>
          )}
        </CardFooter>
      </Card>
      <DrawerAcara
        onClose={() => setisOpen(false)}
        eventId={id}
        tanggal={tanggal}
        lokasi={lokasi}
      />
    </Drawer>
  );
};

export default CardEvent;
