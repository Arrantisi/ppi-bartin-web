"use client";

import { useState } from "react";
import {
  IconBookmark,
  IconBrandTelegram,
  IconDots,
  IconHeart,
  IconMessageCircle,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

type TEventCard = {
  nama: string;
  lokasi: string;
  foto: string;
  description: string;
};

export const EventCard = ({ description, foto, lokasi, nama }: TEventCard) => {
  const [isJoined, setIsJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(1090);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const handleJoin = () => {
    if (!isJoined) {
      setParticipantCount((prev) => prev + 1);
    } else {
      setParticipantCount((prev) => prev - 1);
    }
    setIsJoined(!isJoined);
  };

  return (
    <div className="w-full border-b border-foreground/10 pb-6">
      <div className="my-5 space-y-3">
        {/* Header: User Info */}
        <div
          className={`flex items-center justify-between ${isMobile ? "px-2.5" : "px-1"}`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-tr from-yellow-400 to-fuchsia-600 rounded-full p-[2px]">
              <div className="bg-white dark:bg-black rounded-full p-0.5">
                <IconUser className="size-6" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">{nama}</span>
              <span className="text-xs text-foreground/60">{lokasi}</span>
            </div>
          </div>
          <IconDots className="cursor-pointer" />
        </div>

        {/* Image Section */}
        <div className="relative group">
          <Image
            src={foto}
            alt="Event Image"
            height={500}
            width={500}
            className="w-full object-cover rounded-md aspect-square"
          />
          {/* Join Overlay (Optional gaya modern) */}
          <button
            onClick={handleJoin}
            className={`absolute bottom-4 right-4 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg ${
              isJoined
                ? "bg-green-500 text-white"
                : "bg-white text-black hover:scale-105"
            }`}
          >
            {isJoined ? "Joined ✓" : "Join Event"}
          </button>
        </div>

        {/* Interaction Bar */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-4">
            <button className="hover:opacity-60 transition-opacity">
              <IconHeart className="size-7" />
            </button>
            <button className="hover:opacity-60 transition-opacity">
              <IconMessageCircle className="size-7" />
            </button>
            <button className="hover:opacity-60 transition-opacity">
              <IconBrandTelegram className="size-7" />
            </button>
          </div>
          <IconBookmark className="size-7 cursor-pointer" />
        </div>

        {/* Caption & Info */}
        <div className={`px-1 space-y-1 ${isMobile ? "px-1" : ""}`}>
          <p className="text-sm font-bold">
            {participantCount.toLocaleString()} Participants
          </p>
          <div className={`text-sm ${isExpanded ? "" : "line-clamp-2"} `}>
            <span className="font-bold mr-2">{nama}</span>
            <span className="text-foreground/80">{description} </span>
          </div>
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-foreground/50 font-medium ml-1 hover:text-foreground transition-colors text-sm cursor-pointer"
            >
              ...selengkapnya
            </button>
          )}
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-foreground/50 font-medium ml-1 hover:text-foreground transition-colors text-sm cursor-pointer"
            >
              ...sembunyikan
            </button>
          )}
          <p className="text-[10px] text-foreground/50 uppercase font-semibold pt-1">
            1 Week ago
          </p>
        </div>
      </div>
    </div>
  );
};
