"use client";

import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconBookmark,
  IconCalendarWeek,
  IconCopy,
  IconDots,
  IconMapPin,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { formattedDate } from "@/utils/date-format";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DrawerAcara from "../../../drawers/join-events";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import AvatarParticipant from "../../avatars/avatar-participant";
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
import { LoaderOneDemo } from "@/components/loader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

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

  if (isLoading) return <LoaderOneDemo />;

  if (!data)
    return <div className="p-10 text-center">Data tidak ditemukan.</div>;

  const userJoined = data.participants.find(
    ({ user }) => user.id === session?.user.id,
  );
  const capacityFull = data.participants.length >= (data.maxCapacity || 0);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative flex flex-col overflow-hidden ">
        {/* Gambar & Header Sticky */}
        <div className="fixed w-full z-10 ">
          <div className="p-2 top-0 left-0 right-0 px-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="xl"
              className="rounded-full"
              onClick={() => router.back()}
            >
              <IconArrowLeft size={20} />
            </Button>

            <div className="font-bold text-sm">DETAIL ACARA</div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    size={"xl"}
                    className="rounded-full"
                  >
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

        <div className="flex flex-col h-full">
          <Image
            src={imageUrl(data.fileKey)}
            alt={""}
            height={200}
            width={200}
            className="object-cover z-0 w-full h-[400px]"
          />

          <div className="relative rounded-t-[2.5rem] px-6 flex flex-col justify-between bg-background min-h-[510px] -mt-10 pt-7 pb-5">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {data.judul}
              </h1>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground flex items-center justify-between gap-1.5">
                  <Avatar className="size-5">
                    <AvatarImage src={data.creator.image || ""} />
                  </Avatar>
                  Dibuat Oleh{" "}
                  <span className="font-medium text-foreground capitalize">
                    {data.creator.username}
                  </span>
                </div>
                <AvatarParticipant
                  participant={data.participants.map((img) => ({
                    image: img.user.image || "",
                  }))}
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
            </div>

            <div>
              {capacityFull ? (
                <div className="text-center text-base font-semibold rounded-full capitalize bg-primary text-background py-2.5 px-3">
                  sudah penuh
                </div>
              ) : userJoined?.user.id === session?.user.id ? (
                <div className="text-center text-base font-semibold rounded-full capitalize bg-primary text-background py-2.5 px-3">
                  kamu telah join
                </div>
              ) : (
                <DrawerTrigger asChild>
                  <Button className="rounded-full text-base">
                    Daftar Sekarang
                  </Button>
                </DrawerTrigger>
              )}
            </div>
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
