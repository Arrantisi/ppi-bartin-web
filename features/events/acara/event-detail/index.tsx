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
import AvatarParticipant from "@/features/events/acara/avatars/avatar-participant";
import { authClient } from "@/lib/auth/client";
import { imageUrl } from "@/utils/image-url";
import { useEventBySlug } from "@/hooks/use-events";
import { LoaderOneDemo } from "@/components/loader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AlertDEelete } from "@/components/shared/confirm-delete-dialog";
import { EventActionButton } from "@/features/events/acara/action-button-event";
import { DrawerOpsi } from "@/components/shared/content-actions-drawer";
import { DialogTableParticipant } from "@/features/events/acara/avatars/table-participant";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogPopup,
  DialogTrigger,
} from "@/components/animate-ui/components/base/dialog";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { toast } from "sonner";
import { getTwoWords } from "@/utils/get-twowords";

export const EventDetail = ({
  slug,
  readOnly = false,
}: {
  slug: string;
  readOnly?: boolean;
}) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const isReadOnly = readOnly || !session;

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
      description: isReadOnly
        ? "Masuk ke portal untuk berinteraksi"
        : "Tekan dan tahan tombol daftar dibawah!",
    });
  };

  const clean = DOMPurify.sanitize(data.deskripsi, {
    FORBID_ATTR: ["style", "font"], // ← strip style attribute
  });

  return (
    <>
      <Dialog open={isOpenImageDialog} onOpenChange={setIsOpenImageDialog}>
        <Drawer open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
          <div className="max-w-2xl mx-auto bg-background min-h-screen pb-10 pt-3 relative flex flex-col overflow-hidden">
            {/* Header */}
            <div className="absolute w-full z-10">
              <div className="p-2 top-0 left-0 right-0 px-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon-xl"
                  className="rounded-full"
                  onClick={() => router.back()}
                >
                  <IconArrowLeft size={20} />
                </Button>

                <h1 className="h-11 px-[calc(--spacing(4)-1px)] text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5 flex justify-center items-center rounded-4xl border-input bg-background not-dark:bg-clip-padding text-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/6%)] dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:bg-accent/50 dark:[:hover,[data-pressed]]:bg-input/64">
                  Acara
                </h1>

                {!isReadOnly && (
                  <Button
                    variant={"outline"}
                    size={"icon-xl"}
                    className="rounded-full"
                    onClick={() => setIsOpenDrawer(true)}
                  >
                    <IconDots />
                  </Button>
                )}
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
                  <h1 className="title-satu text-text-primary">
                    {data.judul}
                  </h1>
                  <div className="flex items-center justify-between mb-2 h-10 ">
                    <div className="footnote text-text-secondary flex items-center justify-between gap-1.5">
                      <Avatar className="size-5">
                        <AvatarImage src={data.creator.image || ""} />
                      </Avatar>
                      Dibuat Oleh{" "}
                      <span className="text-text-primary font-medium capitalize">
                        {getTwoWords(data.creator.name!)}
                      </span>
                    </div>

                    {!isReadOnly && (
                      <Dialog>
                        <DialogTrigger
                          className={cn(
                            "cursor-pointer px-2 rounded-2xl duration-300 transition-all",
                          )}
                        >
                          <AvatarParticipant
                            participant={data.participants.map((participant) => ({
                              image: participant.user.image || "",
                            }))}
                          />
                        </DialogTrigger>

                        <DialogTableParticipant
                          userCreatorId={data.creator.id}
                          judul={data.judul}
                          participants={data.participants}
                          eventId={data.id}
                        />
                      </Dialog>
                    )}
                  </div>

                  <div className="relative py-3 border-y max-w-full body wrap-anywhere my-4 [&_p]:block prose prose-sm [&_strong]:text-foreground">
                    { isJoined && (
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
                        <span className="subheadline text-text-primary">
                          Tanggal
                        </span>
                        <span className="footnote">
                          {formattedDate(data.date || new Date())}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <IconMapPin size={20} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="subheadline text-text-primary">
                          Lokasi
                        </span>
                        <span className="footnote">
                          {data.lokasi}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {!isReadOnly ? (
                  <div className="w-full">
                    <EventActionButton
                      event={data}
                      sessionUserId={session?.user.id}
                    />
                  </div>
                ) : (
                  <div className="w-full rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                    Konten ini hanya bisa dibaca publik. <a href="/login" className="text-primary hover:underline">
                      Masuk
                    </a>{" "}
                    untuk lebih lanjut.
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isReadOnly && (
            <DrawerOpsi
              userId={session?.user.id || ""}
              creatorId={data.creator.id}
              slug={data.slug}
              title="acara"
              onDelete={handleOpenDelete}
            />
          )}
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
      {!isReadOnly && (
        <AlertDEelete
          type="acara"
          id={data.id}
          href="/acara"
          open={isOpenAlert}
          onOpenChange={setIsOpenAlert}
          onClick={() => setIsOpenAlert(false)}
        />
      )}
    </>
  );
};

