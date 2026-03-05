"use client";

import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconBookmark,
  IconCalendarWeek,
  IconCopy,
  IconDots,
  IconMapPin,
  IconShare,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { formattedDate } from "@/utils/date-format";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DrawerAcara from "../../drawer-acara";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import AvatarParticipant from "../../avatar-participant";
import { authClient } from "@/lib/auth-client";
import { imageUrl } from "@/utils/image-url";
import { useEventBySlug } from "@/hooks/use-events";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const EventDetail = ({ slug }: { slug: string }) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useEventBySlug({ slug });

  useEffect(() => {
    const channel = supabase
      .channel("events")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events"] });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events"] });
        },
      )
      .subscribe((status) => {
        console.log("event-detail", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading)
    return <div className="p-10 text-center">Loading data acara...</div>;

  if (!data)
    return <div className="p-10 text-center">Data tidak ditemukan.</div>;

  const userJoined = data.participants.find(
    ({ user }) => user.id === session?.user.id,
  );
  const capacityFull = data.participants.length >= (data.maxCapacity || 0);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative flex flex-col h-screen bg-background overflow-hidden">
        <Image
          src={imageUrl(data.fileKey)}
          alt={""}
          fill
          className="object-cover z-0 absolute"
          priority
        />

        {/* Gambar & Header Sticky */}
        <div className="fixed w-full z-10 ">
          <div className="p-2 top-0 bg-background left-0 right-0 px-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="xs"
              className="rounded-full"
              onClick={() => router.back()}
            >
              <IconArrowLeft size={20} />
            </Button>

            <div className="font-bold text-sm">DETAIL ACARA</div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} size={"sm"}>
                    <IconDots />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="text-xs">
                    <IconCopy /> Salin link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs">
                    <IconBookmark />
                    Bookmark
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Konten Detail */}
        <div className="pt-[500px] overflow-y-auto bg-red-500">
          <div className="flex-1 relative z-5 rounded-t-[2.5rem] px-6 flex flex-col justify-between bg-background pt-4">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {data.judul}
            </h1>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Oleh{" "}
                <span className="font-medium text-foreground capitalize">
                  {data.creator.username}
                </span>
              </p>
              <AvatarParticipant
                participant={data.participants.map((img) => ({
                  image: img.user.image || "",
                }))}
                totalParticipant={data.participants.length}
                maxCapacity={data.maxCapacity || 0}
              />
            </div>

            <div className="prose prose-sm text-muted-foreground mb-8">
              <p>{data.deskripsi}</p>
            </div>

            {/* Info Waktu & Tempat */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <IconCalendarWeek size={20} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">Tanggal</span>
                  <span className="text-xs text-muted-foregroun">
                    {formattedDate(data.date || new Date())}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <IconMapPin size={20} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">Lokasi</span>
                  <span className="text-xs text-muted-foreground">
                    {data.lokasi}
                  </span>
                </div>
              </div>
            </div>
            {capacityFull ? (
              <div className="text-center text-xs font-semibold rounded-full capitalize bg-primary text-background py-2.5 px-3">
                sudah penuh
              </div>
            ) : userJoined?.user.id === session?.user.id ? (
              <div className="text-center text-xs font-semibold rounded-full capitalize bg-primary text-background py-2.5 px-3">
                kamu telah join
              </div>
            ) : (
              <DrawerTrigger asChild>
                <Button className="rounded-full text-xs">
                  Daftar Sekarang
                </Button>
              </DrawerTrigger>
            )}
          </div>

          {/* Action Button */}
        </div>
      </div>

      <DrawerAcara
        eventId={data.id}
        onClose={() => setIsOpen(false)}
        tanggal={formattedDate(data.date || new Date())}
        lokasi={data.lokasi || ""}
      />
    </Drawer>
  );
};
