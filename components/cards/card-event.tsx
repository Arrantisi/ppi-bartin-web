"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "../ui/card";
import { IconCalendarWeek, IconMapPin } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import DrawerAcara from "../drawers/join-events";
import { useState } from "react";
import AvatarParticipant from "../event/avatars/avatar-participant";
import { authClient } from "@/lib/auth-client";
import { Dialog, DialogTrigger } from "../animate-ui/components/base/dialog";
import { cn } from "@/lib/utils";
import { TgetAllEvent } from "@/server/data/events";
import { imageUrl } from "@/utils/image-url";
import { formattedDate } from "@/utils/date-format";
import { DialogTableParticipant } from "../event/avatars/table-participant";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
        <Card className="py-0 max-w-sm w-full">
          <div className="object-cover">
            <Image
              src={imageUrl(props.fileKey)}
              alt="card-event"
              height={200}
              width={200}
              className="w-full h-60 object-cover rounded-t-4xl "
            />
          </div>

          <CardContent className="px-3">
            <h1 className="judul-card-event line-clamp-2">{props.judul} </h1>
            <div className="flex items-center justify-between mt-1">
              <div className="subtitle-card-event text-foreground flex items-center gap-2">
                <Avatar className="size-5">
                  <AvatarImage src={props.creator.image || ""} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                created by{" "}
                <span className="capitalize font-semibold">
                  {props.creator.username}
                </span>
              </div>
            </div>
            <p className="line-clamp-2 text-foreground/60 text-sm pt-2">
              {props.deskripsi}
            </p>

            <div className="flex flex-col items-start justify-start text-muted-foreground/80 my-3 gap-1">
              <div className=" flex items-start gap-1.5">
                <div className="size-4 flex items-center justify-center">
                  <IconCalendarWeek className="size-4 " />
                </div>
                <span className="text-xs font-semibold w-full">
                  {formattedDate(props.date)}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <div className="size-4 flex items-center justify-center">
                  <IconMapPin className="size-4 " />
                </div>
                <span className="text-xs font-semibold">{props.lokasi}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-3 justify-between w-full">
            <DialogTrigger
              className={cn(
                "cursor-pointer py-1.5 px-2 rounded-2xl duration-300 transition-all",
              )}
            >
              <AvatarParticipant
                participant={props.participants.map((data) => ({
                  image: data.user.image || "",
                }))}
              />
            </DialogTrigger>
            <div className="w-full max-w-[218px]">
              {capacityFull ? (
                <div className="w-full text-center text-xs font-semibold rounded-full capitalize bg-primary text-primary-foreground py-2.5 px-3">
                  Penuh
                </div>
              ) : userJoined?.user.id === session?.user.id ? (
                <div className="w-full text-center text-xs font-semibold rounded-full capitalize bg-primary text-primary-foreground py-2.5 px-3">
                  Mengitkuti
                </div>
              ) : (
                <DrawerTrigger asChild>
                  <Button className="rounded-full text-xs w-full text-center">
                    Ikuti
                  </Button>
                </DrawerTrigger>
              )}
            </div>
          </CardFooter>
        </Card>
        <DialogTableParticipant participants={props.participants} />
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
