"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { IconCalendarWeek, IconMapPin } from "@tabler/icons-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import DrawerAcara from "./drawer-acara";
import { useState } from "react";
import AvatarParticipant from "./avatar-participant";
import { authClient } from "@/lib/auth-client";
import { AspectRatio } from "../ui/aspect-ratio";
import { Dialog, DialogTrigger } from "../animate-ui/components/base/dialog";
import { DialogTableParticipant } from "./table-participant";
import { cn } from "@/lib/utils";
import { TgetAllEvent } from "@/server/data/events";
import { imageUrl } from "@/utils/image-url";
import { formattedDate } from "@/utils/date-format";

const CardEvent = ({ ...props }: TgetAllEvent) => {
  const [isOpen, setisOpen] = useState(false);

  const { data: session } = authClient.useSession();

  const userJoined = props.participants.find(
    (data) => data.user.id === session?.user.id,
  );
  const capacityFull = props.participants.length >= props.maxCapacity;

  return (
    <Dialog>
      <Drawer open={isOpen} onOpenChange={setisOpen}>
        <Card className="py-2 shadow-2xl">
          <CardHeader className={`px-2 mb-1`}>
            <AspectRatio ratio={16 / 9}>
              <Image
                src={imageUrl(props.fileKey)}
                alt="card-event"
                height={200}
                width={200}
                className="w-full h-75 object-cover rounded-3xl"
              />
            </AspectRatio>
          </CardHeader>

          <CardContent className="px-3">
            <h1 className="judul-card-event">{props.judul}</h1>
            <div className="flex items-center justify-between mt-3">
              <h4 className="subtitle-card-event">
                created by{" "}
                <span className="capitalize">{props.creator.username}</span>
              </h4>
              <Link
                href={`/home/events/${props.slug}`}
                className="text-xs text-accent-foreground mr-3"
              >
                Lebih Detail
              </Link>
            </div>
            <div className="grid grid-cols-6 items-start text-muted-foreground/80 my-3">
              <div className=" col-span-2 flex items-start gap-1.5">
                <IconCalendarWeek className="size-4 " />
                <span className="text-xs font-semibold w-full">
                  {formattedDate(props.date)}
                </span>
              </div>
              <div className="col-span-4 flex items-start gap-1.5">
                <IconMapPin className="size-4 " />
                <span className="text-xs font-semibold">{props.lokasi}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-3 pb-3 justify-between">
            <DialogTrigger
              className={cn(
                "cursor-pointer py-1.5 px-2 rounded-2xl duration-300 transition-all",
              )}
            >
              <AvatarParticipant
                maxCapacity={props.maxCapacity}
                participant={props.participants.map((data) => ({
                  image: data.user.image || "",
                }))}
                totalParticipant={props.participants.length}
              />
            </DialogTrigger>
            {capacityFull ? (
              <div className="text-xs font-semibold rounded-full capitalize bg-primary text-primary-foreground py-2.5 px-3">
                Penuh
              </div>
            ) : userJoined?.user.id === session?.user.id ? (
              <div className="text-xs font-semibold rounded-full capitalize bg-primary text-primary-foreground py-2.5 px-3">
                Mengitkuti
              </div>
            ) : (
              <DrawerTrigger asChild>
                <Button className="rounded-full text-xs">Ikuti</Button>
              </DrawerTrigger>
            )}
          </CardFooter>
        </Card>
        <DialogTableParticipant eventId={props.id} />
        <DrawerAcara
          onClose={() => setisOpen(false)}
          eventId={props.id}
          tanggal={formattedDate(props.date)}
          lokasi={props.lokasi}
        />
      </Drawer>
    </Dialog>
  );
};

export default CardEvent;
