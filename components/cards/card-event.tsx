"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  IconCalendarWeek,
  IconClockHour4,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import AvatarParticipant from "../event/avatars/avatar-participant";
import { authClient } from "@/lib/auth-client";
import { Dialog, DialogTrigger } from "../animate-ui/components/base/dialog";
import { cn } from "@/lib/utils";
import { TgetAllEvent } from "@/server/data/events";
import { imageUrl } from "@/utils/image-url";
import { formattedDate } from "@/utils/date-format";
import { DialogTableParticipant } from "../event/avatars/table-participant";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { getTwoWords } from "@/utils/get-twowords";
import { EventActionButton } from "../event/action-button-event";

const CardEvent = ({ ...props }: TgetAllEvent) => {
  const { data: session } = authClient.useSession();

  const isFull = props.participants.length >= props.maxCapacity;

  return (
    <Dialog>
      <Card className="py-0 ">
        <Link
          href={`/home/acara/${props.slug}`}
          key={props.id}
          className="w-full h-[420px] relative space-y-5"
        >
          <div className="relative h-60 w-full">
            <Image
              src={imageUrl(props.fileKey)}
              alt="card-event"
              fill
              className="object-cover rounded-t-4xl"
            />
            {/* CAPACITY BADGE OVERLAY */}
            <div className="absolute top-4 right-4 bg-background backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <IconUsers className="size-3.5 text-primary" />
              <span
                className={cn(
                  "text-[10px] font-bold",
                  isFull ? "text-destructive" : "text-foreground",
                )}
              >
                {props.participants.length} / {props.maxCapacity} Peserta
              </span>
            </div>
          </div>

          <CardContent className="px-3 space-y-3">
            <h1 className="judul-card-event line-clamp-2">{props.judul}</h1>
            <div className="flex items-center justify-between mt-1">
              <div className="subtitle-card-event text-foreground flex items-center gap-2">
                <Avatar className="size-5">
                  <AvatarImage src={props.creator.image || ""} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                Dibuat Oleh{" "}
                <span className="capitalize font-semibold">
                  {getTwoWords(props.creator.name || "")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2.5 text-muted-foreground/90 border-dotted border-t pt-2 my-2">
              <div className="flex items-center gap-2">
                <IconCalendarWeek className="size-4 text-primary" />
                <span className="text-xs font-medium">
                  {formattedDate(props.date)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-rose-600">
                <IconClockHour4 className="size-4" />
                <span className="text-xs font-bold">
                  Batas Daftar: {formattedDate(props.batasDaftar)}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <IconMapPin className="size-4 text-primary shrink-0" />
                <span className="text-xs font-medium line-clamp-1">
                  {props.lokasi}
                </span>
              </div>
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-3 justify-between w-full h-[95px] ">
          <DialogTrigger
            className={cn(
              "cursor-pointer px-2 rounded-2xl duration-300 transition-all",
            )}
          >
            <AvatarParticipant
              participant={props.participants.map((data) => ({
                image: data.user.image || "",
              }))}
            />
          </DialogTrigger>
          <div className="w-full max-w-[180px]">
            <EventActionButton event={props} sessionUserId={session?.user.id} />
          </div>
        </CardFooter>
      </Card>
      <DialogTableParticipant
        userCreatorId={props.creator.id}
        judul={props.judul}
        participants={props.participants}
        eventId={props.id}
      />
    </Dialog>
  );
};

export default CardEvent;
