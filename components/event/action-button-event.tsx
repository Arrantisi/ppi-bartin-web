"use client";

import { TgetAllEvent } from "@/server/data/events";
import { HoldButtonCancel, HoldButtonJoin } from "../buttons";
import { cn } from "@/lib/utils";

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
      <StatusBadge className="bg-secondary text-secondary-foreground">
        Pendaftaran Berakhir
      </StatusBadge>
    );
  }

  if (capacityFull) {
    return (
      <StatusBadge className="bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400 border-orange-200 dark:border-orange-900">
        Kapasitas Penuh
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
      "w-full text-center text-sm font-semibold rounded-full capitalize py-2.5 px-3 border",
      className,
    )}
  >
    {children}
  </div>
);
