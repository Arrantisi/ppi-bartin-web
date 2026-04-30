"use client";

import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconCalendarWeek,
  IconDots,
  IconMapPin,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formattedDate } from "@/utils/date-format";
import { useState } from "react";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import AvatarParticipant from "../../avatars/avatar-participant";
import { authClient } from "@/lib/auth-client";
import { imageUrl } from "@/utils/image-url";
import { useEventBySlug } from "@/hooks/use-events";
import { LoaderOneDemo } from "@/components/loader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog } from "@/components/animate-ui/components/base/alert-dialog";
import { AlertDEelete } from "../../alert-delete";
import { EventActionButton } from "../../action-button-event";
import { DrawerOpsi } from "@/components/drawers/opsi";

export const EventDetail = ({ slug }: { slug: string }) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  const { data, isLoading } = useEventBySlug({ slug });

  if (isLoading) return <LoaderOneDemo />;

  if (!data)
    return <div className="p-10 text-center">Data tidak ditemukan.</div>;

  return (
    <AlertDialog open={isOpenAlert} onOpenChange={setIsOpenAlert}>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative flex flex-col overflow-hidden ">
          {/* Gambar & Header Sticky */}
          <div className="absolute w-full z-10 ">
            <div className="p-2 top-0 left-0 right-0 px-4 flex items-center justify-between">
              <Button
                variant="outline"
                size="icon-xl"
                className="rounded-full"
                onClick={() => router.push("/home/acara")}
              >
                <IconArrowLeft size={20} />
              </Button>

              <h1 className="h-11 px-[calc(--spacing(4)-1px)] text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5 flex justify-center items-center rounded-4xl border-input bg-background not-dark:bg-clip-padding text-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/6%)] dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:bg-accent/50 dark:[:hover,[data-pressed]]:bg-input/64">
                Acara
              </h1>

              <div className="flex gap-2">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant={"outline"}
                      size={"icon-xl"}
                      className="rounded-full"
                    >
                      <IconDots />
                    </Button>
                  </DrawerTrigger>
                  <DrawerOpsi
                    userId={session?.user.id || ""}
                    creatorId={data.creator.id}
                    slug={data.slug}
                    title="acara"
                  />
                </Drawer>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <Image
              src={imageUrl(data.fileKey)}
              alt={""}
              height={200}
              width={200}
              className="object-cover z-0 w-full h-100"
            />

            <div className="relative px-6 flex flex-col justify-between bg-background -mt-10 pt-4 pb-5">
              <div>
                <h1 className="text-[24px] font-bold text-foreground">
                  {data.judul}
                </h1>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[13px] text-muted-foreground flex items-center justify-between gap-1.5">
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

                <div className="max-w-full text-foreground/90 text-[13px] leading-relaxed whitespace-pre-line wrap-anywhere md:text-lg tracking-wide">
                  {(data.deskripsi || "").trim()}
                </div>

                {/* Info Waktu & Tempat */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <IconCalendarWeek size={20} className="" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-semibold">Tanggal</span>
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
                      <span className="text-[13px] font-semibold">Lokasi</span>
                      <span className="text-xs text-muted-foreground">
                        {data.lokasi}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <EventActionButton
                  event={data}
                  sessionUserId={session?.user.id}
                />
              </div>
            </div>
          </div>
        </div>

        <AlertDEelete
          type="acara"
          id={data.id}
          href="/home/events"
          onClick={() => setIsOpenAlert(false)}
        />
      </Drawer>
    </AlertDialog>
  );
};
