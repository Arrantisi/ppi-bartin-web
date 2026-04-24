"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconCalendarWeek,
  IconCopy,
  IconDots,
  IconEdit,
  IconMapPin,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { formattedDate } from "@/utils/date-format";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DrawerAcara from "../../../drawers/join-events";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import AvatarParticipant from "../../avatars/avatar-participant";
import { authClient } from "@/lib/auth-client";
import { imageUrl } from "@/utils/image-url";
import { useEventBySlug } from "@/hooks/use-events";
import { LoaderOneDemo } from "@/components/loader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/components/animate-ui/components/base/alert-dialog";
import { AlertDEelete } from "../../alert-delete";
import { DialogTitle } from "@/components/ui/dialog";
import { goeyToast } from "@/components/ui/goey-toaster";
import { EventActionButton } from "../../action-button-event";

export const EventDetail = ({ slug }: { slug: string }) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  const { data, isLoading } = useEventBySlug({ slug });

  const handleCopyLink = () => {
    const currentUrl = window.location.href; // Mengambil URL halaman detail saat ini

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        // Gunakan toast atau alert sederhana
        goeyToast.success("Link berhasil disalin ke clipboard!");
        // Jika kamu punya library toast (seperti shadcn/ui toast), gunakan itu:
        // toast({ title: "Tersalin!", description: "Link acara telah disalin." });
      })
      .catch((err) => {
        console.error("Gagal menyalin link: ", err);
      });
  };

  if (isLoading) return <LoaderOneDemo />;

  if (!data)
    return <div className="p-10 text-center">Data tidak ditemukan.</div>;

  return (
    <AlertDialog open={isOpenAlert} onOpenChange={setIsOpenAlert}>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative flex flex-col overflow-hidden ">
          {/* Gambar & Header Sticky */}
          <div className="fixed w-full z-10 ">
            <div className="p-2 top-0 left-0 right-0 px-4 flex items-center justify-between">
              <Button
                variant="outline"
                size="icon-xl"
                className="rounded-full"
                onClick={() => router.push("/home/events")}
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
                  <DrawerContent className="p-4">
                    <div className="flex flex-col gap-2 pb-6">
                      <DialogTitle className="text-center text-sm font-medium text-muted-foreground mb-4">
                        Opsi Acara
                      </DialogTitle>

                      <Button
                        variant="ghost"
                        className="justify-start gap-3 h-12 rounded-xl"
                        onClick={() => handleCopyLink()}
                      >
                        <IconCopy size={20} /> Salin Link
                      </Button>

                      {session?.user.id === data.creator.id && (
                        <>
                          <Link href={`/home/events/update/${data.slug}`}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start gap-3 rounded-xl"
                            >
                              <IconEdit size={20} /> Edit Acara
                            </Button>
                          </Link>

                          <AlertDialogTrigger
                            className={buttonVariants({
                              variant: "ghost",
                              className:
                                "w-full justify-start gap-3 rounded-xl bg-destructive/45 ring ring-destructive text-foreground",
                            })}
                          >
                            <IconTrash size={20} />
                            <span>Hapus Acara</span>
                          </AlertDialogTrigger>
                        </>
                      )}
                    </div>
                  </DrawerContent>
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
              className="object-cover z-0 w-full h-[400px]"
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
                      <IconCalendarWeek size={20} />
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

            {/* Action Button */}
          </div>
        </div>

        <AlertDEelete
          type="acara"
          id={data.id}
          href="/home/events"
          onClick={() => setIsOpenAlert(false)}
        />

        <DrawerAcara
          eventId={data.id}
          onClose={() => setIsOpen(false)}
          tanggal={formattedDate(data.date || new Date())}
          lokasi={data.lokasi || ""}
        />
      </Drawer>
    </AlertDialog>
  );
};
