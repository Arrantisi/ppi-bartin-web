"use client";

import { TgetAllEvent } from "@/server/data/events";
import { HoldButtonCancel, HoldButtonJoin } from "../buttons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { TimerOff } from "lucide-react";
import { IconUserOff } from "@tabler/icons-react";

interface EventActionButtonProps {
  event: TgetAllEvent;
  sessionUserId?: string;
}

export const EventActionButton = ({
  event,
  sessionUserId,
}: EventActionButtonProps) => {
  const myParticipation = event.participants.find(
    (p) => p.user.id === sessionUserId,
  );
  const isJoined = !!myParticipation;
  const capacityFull = event.participants.length >= event.maxCapacity;
  const isExpired = new Date(event.date) <= new Date();

  if (isJoined) {
    return (
      <HoldButtonCancel eventId={event.id} participantId={myParticipation.id} />
    );
  }

  if (isExpired) {
    return (
      <StatusBadge className="text-info border-info gap-1.5">
        <TimerOff className="w-3.5 h-3.5" />
        <span>Pendaftaran Berakhir</span>
      </StatusBadge>
    );
  }

  if (capacityFull) {
    return (
      <StatusBadge className="text-warning border-warning gap-1.5">
        <IconUserOff className="w-3.5 h-3.5" />
        <span>Kapasitas Penuh</span>
      </StatusBadge>
    );
  }

  return <HoldButtonJoin eventId={event.id}>Tahan Untuk Ikuti</HoldButtonJoin>;
};

// Sub-komponen kecil untuk status teks agar konsisten
const StatusBadge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      buttonVariants({
        variant: "outline",
        className:
          "w-full text-center text-sm rounded-full capitalize py-2.5 px-3",
      }),
      className,
    )}
  >
    {children}
  </div>
);
