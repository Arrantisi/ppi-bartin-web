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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const renderLokasi = (lokasi: string, JoinStatus: boolean) => {
    const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = lokasi.split(URL_REGEX);
    return parts.map((part, index) => {
      if (part.match(/^https?:\/\/|^www\./)) {
        const href = part.startsWith("www.") ? `https://${part}` : part;
        return !JoinStatus ? (
          <a key={index} href={href} target="_blank" rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold break-all">
            {part}
          </a>
        ) : (
          <span key={index} className="break-all">
            <span className="text-text-disabled line-through font-medium">{part}</span>
            <span className="text-text-disabled text-xs"> (daftar terlebih dahulu untuk mengakses)</span>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const clean = DOMPurify.sanitize(data.deskripsi, {
    FORBID_ATTR: ["style", "font"], // ← strip style attribute
  });

  return (
    <>
      <Dialog open={isOpenImageDialog} onOpenChange={setIsOpenImageDialog}>
        <Drawer open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
          <div className="detail-page max-w-2xl mx-auto bg-background min-h-screen pb-10 pt-3">
            <div className="p-2 top-0 left-0 right-0 px-4 flex items-center justify-between">
              <Button
                variant="outline"
                size="icon-xl"
                className="rounded-full"
                onClick={() => router.back()}
              >
                <IconArrowLeft size={20} />
              </Button>

              <h1 className="h-11 px-[calc(--spacing(4)-1px)] text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5 flex justify-center items-center rounded-4xl border border-border bg-background text-text-primary shadow-none">
                Acara
              </h1>

              {!isReadOnly ? (
                <div className="flex gap-2">
                  <Drawer open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
                    <Button
                      variant="outline"
                      size="icon-xl"
                      className="rounded-full"
                      onClick={() => setIsOpenDrawer(true)}
                    >
                      <IconDots />
                    </Button>

                    <DrawerOpsi
                      userId={session?.user.id || ""}
                      creatorId={data.creator.id}
                      slug={data.slug}
                      title="acara"
                      onDelete={handleOpenDelete}
                    />
                  </Drawer>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="icon-xl"
                  className="rounded-full opacity-0 pointer-events-none"
                >
                  <IconDots />
                </Button>
              )}
            </div>

            <div className="px-5">
              <div className="flex items-center gap-3 mt-6">
                <Avatar className="size-10">
                  <AvatarImage src={data.creator.image || ""} />
                  <AvatarFallback>{getTwoWords(data.creator.name || "")}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="body text-text-primary font-semibold capitalize">
                    {getTwoWords(data.creator.name!)}
                  </p>
                  <div className="flex items-center gap-2 footnote text-text-secondary">
                    <span>{formattedDate(data.createdAt)}</span>
                    <div className="size-1 rounded-full bg-muted-foreground" />
                    <span>{formattedDate(data.date || new Date())}</span>
                  </div>
                </div>
              </div>

              <h1 className="title-satu mt-4 text-text-primary">
                {data.judul}
              </h1>

              <div className="relative w-full mt-5 overflow-hidden rounded-3xl border border-border shadow-sm">
                <Image
                  src={imageUrl(data.fileKey)}
                  alt="Acara"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto object-cover"
                  priority
                />
                <button
                  onClick={() => setIsOpenImageDialog(true)}
                  className="flex items-center justify-center gap-2 absolute bottom-3 right-3 rounded-full border border-border bg-background/90 p-2 text-center text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-background cursor-pointer"
                >
                  <IconEye size={16} />
                </button>
              </div>

              <article className="mt-8 mx-auto">
                <div className="detail-page relative py-3 border-y border-border max-w-full body wrap-anywhere my-4 prose prose-sm dark:prose-invert prose-neutral prose-headings:font-semibold prose-p:text-[--text-secondary] prose-strong:text-[--text-primary] prose-a:text-[--accent] prose-img:rounded-[10px] max-w-none [&_p]:block [&_strong]:text-text-primary">
                  {isJoined && (
                    <button
                      className="h-full bg-transparent absolute w-full"
                      onClick={handleToastLink}
                    />
                  )}

                  {parse(clean)}
                </div>
              </article>

              <div className="detail-meta mb-8">
                <div className="detail-meta-row">
                  <div className="rounded-full border border-border bg-background p-2 text-text-disabled">
                    <IconCalendarWeek className="detail-meta-icon" size={16} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="detail-meta-label">Tanggal</span>
                    <span className="detail-meta-value">
                      {formattedDate(data.date || new Date())}
                    </span>
                  </div>
                </div>

                <div className="detail-meta-row">
                  <div className="rounded-full border border-border bg-background p-2 text-text-disabled">
                    <IconMapPin className="detail-meta-icon" size={16} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="detail-meta-label">Lokasi</span>
                    <span className="detail-meta-value">
                      {!isReadOnly
                        ? renderLokasi(data.lokasi || "", isJoined)
                        : "Masuk untuk melihat lokasi"}
                    </span>
                  </div>
                </div>
              </div>

              {!isReadOnly ? (
                <div className="detail-cta-wrap text-text-primary">
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

