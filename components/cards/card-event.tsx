"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "../ui/card";
import { IconCalendarWeek, IconMapPin } from "@tabler/icons-react";
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
import { HoldButtonJoin } from "../buttons";

const CardEvent = ({ ...props }: TgetAllEvent) => {
  const { data: session } = authClient.useSession();

  const userJoined = props.participants.find(
    (data) => data.user.id === session?.user.id,
  );
  const capacityFull = props.participants.length >= props.maxCapacity;

  return (
    <Dialog>
      <Card className="py-0 ">
        <Link
          href={`/home/events/${props.slug}`}
          key={props.id}
          className="w-full min-h-[520px] relative space-y-5"
        >
          <div className="object-cover">
            <Image
              src={imageUrl(props.fileKey)}
              alt="card-event"
              height={2000}
              width={2000}
              className="w-full h-60 object-cover rounded-t-4xl "
            />
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
        </Link>

        <CardFooter className="p-3 justify-between w-full absolute bottom-0">
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
              <div className="w-full text-center text-sm font-semibold rounded-full capitalize bg-secondary text-secondary-foreground py-2.5 px-3">
                kapasitas Penuh
              </div>
            ) : props.date <= new Date() ? (
              <div className="w-full text-center text-sm font-semibold rounded-full capitalize bg-secondary text-secondary-foreground py-2.5 px-3">
                Pendaftaran Telah Berakhir
              </div>
            ) : userJoined?.user.id === session?.user.id ? (
              <div className="w-full text-center text-sm font-semibold rounded-full capitalize bg-secondary text-secondary-foreground py-2.5 px-3">
                Kamu Telah Ikuti
              </div>
            ) : (
              <HoldButtonJoin eventId={props.id}>
                Tahan Untuk Ikuti
              </HoldButtonJoin>
            )}
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
