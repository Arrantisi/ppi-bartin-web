"use client";

import { differenceInCalendarDays, format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "../ui/card";
import { IconUsers } from "@tabler/icons-react";
import AvatarParticipant from "@/features/events/acara/avatars/avatar-participant";
import { Dialog, DialogTrigger } from "../animate-ui/components/base/dialog";
import { cn } from "@/lib/utils";
import { TgetAllEvent } from "@/server/data/events";
import { imageUrl } from "@/utils/image-url";
import { formatDateTime } from "@/utils/date-format";
import { DialogTableParticipant } from "@/features/events/acara/avatars/table-participant";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { EventActionButton } from "@/features/events/acara/action-button-event";

const CardEvent = ({
  hrefBase = "/acara",
  showActions = true,
  ...props
}: TgetAllEvent & { hrefBase?: string; showActions?: boolean }) => {
  const { data: session } = authClient.useSession();
  const isFull = props.participants.length >= props.maxCapacity;
  const deadlineDate = new Date(props.batasDaftar);
  const daysLeft = differenceInCalendarDays(deadlineDate, new Date());
  const isClosed = isFull || daysLeft < 0;
  const rawDate = new Date(props.date);
  const metaDate =
    rawDate.getHours() === 0 && rawDate.getMinutes() === 0
      ? format(rawDate, "E, d LLL", { locale: id })
      : formatDateTime(rawDate);
  const deadlineLabel =
    deadlineDate.getHours() === 0 && deadlineDate.getMinutes() === 0
      ? format(deadlineDate, "E, d LLL", { locale: id })
      : formatDateTime(deadlineDate);
  const deadlineCopy = isClosed
    ? "Pendaftaran Berakhir"
    : daysLeft <= 1
      ? `Pendaftaran ditutup hari ini!!`
      : daysLeft <= 3
        ? `Daftar sebelum ${deadlineLabel} (${daysLeft} hari lagi)`
        : `Daftar sebelum ${deadlineLabel}`;
  const deadlineTone = isClosed
    ? "text-text-disabled"
    : daysLeft <= 1
      ? "text-danger"
      : daysLeft <= 7
        ? "text-warning"
        : "text-text-disabled";

  const card = (
    <Card className="gap-0 overflow-hidden rounded-[10px] border border-border bg-surface py-0 shadow-none flex flex-col h-full">
      <Link
        href={`${hrefBase}/${props.slug}`}
        key={props.id}
        className="flex w-full flex-col overflow-hidden rounded-[10px] text-left grow"
      >
        <div className="relative h-60 w-full">
          <Image
            src={imageUrl(props.fileKey)}
            alt="card-event"
            fill
            className="object-cover"
          />
          <div className="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5">
            {props.environment && props.environment !== "production" && (
              <span className="rounded-[4px] bg-[rgba(0,0,0,.55)] px-1.5 py-0.75 font-mono text-[0.625rem] font-medium leading-[1.4] text-white backdrop-blur-xs">
                {props.environment === "local" ? "LOCAL" : "PREVIEW"}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-bg px-2 py-0.75 backdrop-blur-xs">
              <IconUsers className="size-3.5 text-text-primary" />
              <span className="font-mono text-[0.6875rem] font-medium leading-[1.4] text-text-primary">
                {props.participants.length} / {props.maxCapacity} Peserta
              </span>
            </span>
          </div>
        </div>

        <CardContent className="space-y-2.5 px-3 py-3 flex flex-col grow">
          <div className="card-meta uppercase font-mono">Acara</div>

          <div className="card-title line-clamp-2 mb-auto">{props.judul}</div>

          <div className="card-meta line-clamp-1 text-text-secondary">
            {metaDate} ·{" "}
            {showActions ? props.lokasi : "Masuk untuk detail lokasi"}
          </div>

          <div className={cn("card-meta line-clamp-1", deadlineTone)}>
            {deadlineCopy}
          </div>
        </CardContent>
      </Link>

      {showActions ? (
        <CardFooter className="flex items-center justify-between gap-3 px-3 pb-3 pt-0">
          <DialogTrigger
            className={cn(
              "cursor-pointer rounded-2xl px-1 transition-all duration-300",
            )}
          >
            <AvatarParticipant
              participant={props.participants.map((data) => ({
                image: data.user.image || "",
              }))}
            />
          </DialogTrigger>
          {isClosed ? (
            <div className="pointer-events-none text-sm font-medium text-text-disabled">
              Ditutup
            </div>
          ) : (
            <div className="w-full max-w-45">
              <EventActionButton
                event={props}
                sessionUserId={session?.user.id}
              />
            </div>
          )}
        </CardFooter>
      ) : (
        <CardFooter className="px-3 pb-3 pt-0">
          <div className="card-helper">
            Baca detail acara untuk informasi lengkap.
          </div>
        </CardFooter>
      )}
    </Card>
  );

  if (!showActions) {
    return card;
  }

  return (
    <Dialog>
      {card}
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
