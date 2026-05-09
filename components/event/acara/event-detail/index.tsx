"use client";

import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconCalendarWeek,
  IconDots,
  IconEye,
  IconMapPin,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formattedDate } from "@/utils/date-format";
import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import AvatarParticipant from "../../avatars/avatar-participant";
import { authClient } from "@/lib/auth-client";
import { imageUrl } from "@/utils/image-url";
import { useEventBySlug } from "@/hooks/use-events";
import { LoaderOneDemo } from "@/components/loader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AlertDEelete } from "../../alert-delete";
import { EventActionButton } from "../../action-button-event";
import { DrawerOpsi } from "@/components/drawers/opsi";
import {
  Dialog,
  DialogClose,
  DialogPopup,
} from "@/components/animate-ui/components/base/dialog";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { toast } from "sonner";

export const EventDetail = ({ slug }: { slug: string }) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isOpenImageDialog, setIsOpenImageDialog] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const { data, isLoading } = useEventBySlug({ slug });

  if (isLoading) return <LoaderOneDemo />;
  if (!data)
    return <div className="p-10 text-center">Data tidak ditemukan.</div>;

  const myParticipation = data.participants.find(
    (p) => p.user.id === session?.user.id,
  );
  const isJoined = !myParticipation;

  const handleOpenDelete = () => {
    setIsOpenDrawer(false);
    setTimeout(() => setIsOpenAlert(true), 300);
  };

  const handleToastLink = () => {
    toast.info("Info", {
      description: "Kamu Harus join dulu kalau ingin isi form event ini!!!",
    });
  };

  const clean = DOMPurify.sanitize(data.deskripsi, {
    FORBID_ATTR: ["style", "font"], // ← strip style attribute
  });

  return (
    <>
      <Dialog open={isOpenImageDialog} onOpenChange={setIsOpenImageDialog}>
        <Drawer open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
          <div className="relative flex flex-col overflow-hidden">
            {/* Header */}
            <div className="absolute w-full z-10">
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

                <Button
                  variant={"outline"}
                  size={"icon-xl"}
                  className="rounded-full"
                  onClick={() => setIsOpenDrawer(true)}
                >
                  <IconDots />
                </Button>
              </div>
            </div>

            {/* Konten */}
            <div className="flex flex-col h-full">
              <div className="relative">
                <Image
                  src={imageUrl(data.fileKey)}
                  alt={""}
                  height={200}
                  width={200}
                  className="object-cover z-0 w-full h-100"
                />
                <button
                  onClick={() => setIsOpenImageDialog(true)}
                  className="flex items-center justify-center gap-2 absolute bottom-13 right-3 p-2 bg-background rounded-xl shadow border-border text-center text-sm font-medium hover:bg-background/80 cursor-pointer transition-all duration-300"
                >
                  <IconEye size={16} />
                </button>
              </div>

              <div className="relative px-6 flex flex-col justify-between bg-background -mt-10 pt-4 pb-5">
                <div>
                  <h1 className="text-[24px] font-bold text-foreground">
                    {data.judul}
                  </h1>
                  <div className="flex items-center justify-between mb-2 h-10 ">
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

                  <div className="relative py-3 border-y max-w-full text-foreground/90 text-[13px] leading-relaxed wrap-anywhere md:text-lg tracking-wide my-4 [&_p]:block prose prose-sm">
                    {isJoined && (
                      <button
                        className="h-full bg-transparent absolute w-full"
                        onClick={handleToastLink}
                      />
                    )}

                    {parse(clean)}
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <IconCalendarWeek size={20} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-semibold">
                          Tanggal
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formattedDate(data.date || new Date())}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <IconMapPin size={20} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-semibold">
                          Lokasi
                        </span>
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

          <DrawerOpsi
            userId={session?.user.id || ""}
            creatorId={data.creator.id}
            slug={data.slug}
            title="acara"
            onDelete={handleOpenDelete}
          />
        </Drawer>

        {/* DialogPopup di luar Drawer */}
        <DialogPopup showCloseButton={false}>
          <Image
            src={imageUrl(data.fileKey)}
            alt={""}
            height={200}
            width={200}
            className="object-cover z-0 w-full"
          />
          <DialogClose>
            <Button variant="outline" size="icon-xl" className="rounded-full">
              <IconX size={16} />
            </Button>
          </DialogClose>
        </DialogPopup>
      </Dialog>

      {/*
        AlertDEelete ditaruh di LUAR semua portal (Drawer & Dialog).
        Komponen ini sekarang pakai modal sendiri (motion + fixed positioning)
        sehingga tidak bergantung pada AlertDialog context sama sekali.
      */}
      <AlertDEelete
        type="acara"
        id={data.id}
        href="/home/acara"
        open={isOpenAlert}
        onOpenChange={setIsOpenAlert}
        onClick={() => setIsOpenAlert(false)}
      />
    </>
  );
};
