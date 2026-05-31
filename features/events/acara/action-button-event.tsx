"use client";

import { TgetAllEvent } from "@/server/data/events";
import { HoldButtonCancel, HoldButtonJoin } from "@/components/buttons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
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
      <div className="flex justify-end">
        <HoldButtonCancel eventId={event.id} participantId={myParticipation.id} />
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="flex justify-end">
        <StatusBadge className="text-info border-info gap-1.5">
          <TimerOff className="w-3.5 h-3.5" />
          <span>Pendaftaran Berakhir</span>
        </StatusBadge>
      </div>
    );
  }

  if (capacityFull) {
    return (
      <div className="flex justify-end">
        <StatusBadge className="text-warning border-warning gap-1.5">
          <IconUserOff className="w-3.5 h-3.5" />
          <span>Kapasitas Penuh</span>
        </StatusBadge>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <HoldButtonJoin eventId={event.id}>Tekan untuk mendaftar</HoldButtonJoin>
    </div>
  );
};

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
          "inline-flex w-fit text-center text-sm rounded-full capitalize py-2.5 px-3",
      }),
      className,
    )}
  >
    {children}
  </div>
);
