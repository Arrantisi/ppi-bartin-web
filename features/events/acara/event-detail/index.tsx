"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import linkifyHtml from "linkify-html";
import { differenceInCalendarDays, endOfDay, isBefore } from "date-fns";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCalendarWeek,
  IconChevronRight,
  IconClock,
  IconDots,
  IconEye,
  IconMapPin,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { LoaderOneDemo } from "@/components/loader";
import { AlertDEelete } from "@/components/shared/confirm-delete-dialog";
import { DrawerOpsi } from "@/components/shared/content-actions-drawer";
import { SharePopover } from "@/components/shared/share-popover";
import {
  Dialog,
  DialogClose,
  DialogPopup,
  DialogTrigger,
} from "@/components/animate-ui/components/base/dialog";
import { EventActionButton } from "@/features/events/acara/action-button-event";
import AvatarParticipant from "@/features/events/acara/avatars/avatar-participant";
import { DialogTableParticipant } from "@/features/events/acara/avatars/table-participant";
import { RelatedEvents } from "./related-events";
import { useEventBySlug } from "@/hooks/use-events";
import type { TgetEventBySlug } from "@/server/data/events";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { formattedDate, formatDateTime } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";
import { getTwoWords } from "@/utils/get-twowords";

/**
 * Linkify + DOMPurify: menyatukan sanitasi artikel dan tautan lokasi.
 */
const processHtmlContent = (rawText: string, customAnchorClass?: string) => {
  const htmlWithLinks = linkifyHtml(rawText, {
    target: "_blank",
    attributes: {
      rel: "noopener noreferrer",
      ...(customAnchorClass ? { class: customAnchorClass } : {}),
    },
    validate: {
      url: (value) => /^(http|https):\/\//.test(value) || value.includes("."),
    },
  });

  return DOMPurify.sanitize(htmlWithLinks, {
    FORBID_ATTR: ["style", "font"],
    ADD_ATTR: ["target", "rel", "class"],
  });
};

export const EventDetail = ({
  slug,
  readOnly = false,
  initialData,
}: {
  slug: string;
  readOnly?: boolean;
  initialData?: TgetEventBySlug;
}) => {
  const { data: session } = authClient.useSession();
  const isPublicVisitor = readOnly || !session;
  const hrefBase = isPublicVisitor ? "/acara" : "/home/acara";

  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isOpenImageDialog, setIsOpenImageDialog] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  useEffect(() => {
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      if ("target" in node && node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    });
    return () => {
      DOMPurify.removeHook("afterSanitizeAttributes");
    };
  }, []);

  const { data, isLoading } = useEventBySlug({ slug, initialData });

  const cleanDeskripsi = useMemo(
    () => processHtmlContent(data?.deskripsi || ""),
    [data?.deskripsi],
  );

  if (isLoading) return <LoaderOneDemo />;

  if (!data) {
    return (
      <div className="mx-auto flex min-h-[60svh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full border border-border bg-surface text-text-secondary">
          <IconCalendarWeek className="size-8" aria-hidden />
        </div>
        <h1 className="title-tiga text-text-primary">Acara tidak ditemukan</h1>
        <p className="body text-text-secondary">
          Acara dengan tautan ini mungkin sudah dihapus atau tidak tersedia.
        </p>
        <Link href={hrefBase} className={buttonVariants({ variant: "outline" })}>
          <IconArrowLeft aria-hidden />
          Kembali ke acara
        </Link>
      </div>
    );
  }

  const myParticipation = data.participants.find(
    (p) => p.user.id === session?.user.id,
  );
  const isJoined = !!myParticipation;
  const isCapacityFull = data.participants.length >= data.maxCapacity;
  const deadlineDate = new Date(data.batasDaftar);
  const isDeadlinePassed = isBefore(endOfDay(deadlineDate), new Date());
  const daysLeft = differenceInCalendarDays(deadlineDate, new Date());
  const isClosed = isCapacityFull || isDeadlinePassed;
  const shouldGateContent = !isPublicVisitor && !isJoined;

  const deadlineCopy = isCapacityFull
    ? "Kapasitas Penuh"
    : isDeadlinePassed
      ? "Pendaftaran Berakhir"
      : daysLeft <= 1
        ? "Pendaftaran ditutup hari ini"
        : `Daftar sebelum ${formatDateTime(deadlineDate)}`;
  const deadlineTone = isClosed
    ? "text-text-disabled"
    : daysLeft <= 1
      ? "text-danger"
      : daysLeft <= 7
        ? "text-warning"
        : "text-text-disabled";
  const deadlineDot = isClosed
    ? "bg-text-disabled"
    : daysLeft <= 1
      ? "bg-danger"
      : daysLeft <= 7
        ? "bg-warning"
        : "bg-text-disabled";

  const handleOpenDelete = () => {
    setIsOpenDrawer(false);
    setTimeout(() => setIsOpenAlert(true), 300);
  };

  const handleGatedClick = () => {
    toast.info("Informasi terkunci", {
      description: "Tekan dan tahan tombol daftar di bawah untuk mengakses detail ini.",
    });
  };

  // Peserta terdaftar boleh membuka tautan lokasi. User login yang belum daftar
  // melihat tautan disensor; pengunjung publik sudah ditangani di bawah.
  const renderLokasiContent = () => {
    const lokasiStr = data.lokasi || "";
    if (!lokasiStr) return "-";
    if (isPublicVisitor) return "Masuk untuk melihat lokasi";

    if (isJoined) {
      return parse(
        processHtmlContent(
          lokasiStr,
          "font-semibold text-text-primary underline underline-offset-2 break-all",
        ),
      );
    }

    const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = lokasiStr.split(URL_REGEX);

    return (
      <span className="break-all">
        {parts.map((part, index) => {
          if (!/^(https?:\/\/|www\.)/.test(part)) {
            return <span key={index}>{part}</span>;
          }
          return (
            <span key={index}>
              <span className="font-medium text-text-disabled line-through">
                {part}
              </span>
              <span className="mt-0.5 block font-mono text-[0.6875rem] text-text-disabled sm:mt-0">
                {" "}
                (daftar terlebih dahulu untuk mengakses)
              </span>
            </span>
          );
        })}
      </span>
    );
  };

  const participantImages = data.participants.map((p) => ({
    image: p.user.image || "",
  }));

  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-5 pb-16 pt-8 md:px-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[0.8125rem] text-text-secondary"
        >
          <Link
            href={hrefBase}
            className="inline-flex items-center gap-1.5 rounded-sm transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring"
          >
            <IconArrowLeft className="size-4" aria-hidden />
            Acara
          </Link>
          <IconChevronRight
            className="size-3.5 shrink-0 text-text-disabled"
            aria-hidden
          />
          <span className="truncate text-text-disabled">Detail acara</span>
        </nav>

        <header className="mt-8 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-secondary">
              Acara
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-mono text-[0.75rem]",
                deadlineTone,
              )}
            >
              <span
                aria-hidden
                className={cn("size-1.5 shrink-0 rounded-full", deadlineDot)}
              />
              {deadlineCopy}
            </span>
          </div>

          <h1 className="title-satu text-text-primary">{data.judul}</h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-10 shrink-0">
                <AvatarImage src={data.creator.image || ""} />
                <AvatarFallback>
                  {getTwoWords(data.creator.name || "PP").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="body truncate font-semibold capitalize text-text-primary">
                  {getTwoWords(data.creator.name!)}
                </p>
                <p className="footnote text-text-secondary">
                  {formattedDate(data.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SharePopover title={data.judul} />
              {!isPublicVisitor && (
                <Drawer open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpenDrawer(true)}
                  >
                    <IconDots aria-hidden />
                    Opsi
                  </Button>
                  <DrawerOpsi
                    userId={session?.user.id || ""}
                    creatorId={data.creator.id}
                    slug={data.slug}
                    title="acara"
                    onDelete={handleOpenDelete}
                  />
                </Drawer>
              )}
            </div>
          </div>
        </header>

        <figure className="relative mt-8 overflow-hidden rounded-3xl border border-border bg-surface">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={imageUrl(data.fileKey)}
              alt={data.judul}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          <button
            type="button"
            aria-label="Perbesar gambar acara"
            onClick={() => setIsOpenImageDialog(true)}
            className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full border border-border bg-bg/90 text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
          >
            <IconEye className="size-4" aria-hidden />
          </button>
        </figure>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-text-secondary">
              <IconCalendarWeek className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-disabled">
                Tanggal acara
              </p>
              <p className="body text-text-primary">
                {formatDateTime(new Date(data.date))}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-text-secondary">
              <IconMapPin className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-disabled">
                Lokasi
              </p>
              <p className="body break-words text-text-primary">
                {renderLokasiContent()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-text-secondary">
              <IconUsers className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-disabled">
                Kuota peserta
              </p>
              <p className="body text-text-primary">
                {data.participants.length} / {data.maxCapacity} peserta
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-text-secondary">
              <IconClock className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-disabled">
                Batas pendaftaran
              </p>
              <p className={cn("body", deadlineTone)}>{formatDateTime(deadlineDate)}</p>
            </div>
          </div>
        </div>

        {!isPublicVisitor && (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
            <Dialog>
              <DialogTrigger className="cursor-pointer rounded-2xl px-1 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-ring">
                <AvatarParticipant participant={participantImages} />
              </DialogTrigger>
              <DialogTableParticipant
                userCreatorId={data.creator.id}
                judul={data.judul}
                participants={data.participants}
                eventId={data.id}
              />
            </Dialog>
            <p className="footnote text-text-secondary">
              Lihat daftar peserta ({data.participants.length})
            </p>
          </div>
        )}

        <div className="relative mt-10">
          {shouldGateContent && (
            <button
              type="button"
              aria-label="Informasi terkunci, daftar untuk mengakses"
              onClick={handleGatedClick}
              className="absolute inset-0 z-20 h-full w-full cursor-pointer bg-transparent"
            />
          )}
          <div className="detail-page prose prose-sm max-w-none wrap-anywhere dark:prose-invert prose-neutral prose-headings:font-semibold prose-headings:text-text-primary prose-p:text-[--text-secondary] prose-strong:text-[--text-primary] prose-a:text-[--accent] prose-img:rounded-2xl [&_p]:block [&_strong]:text-text-primary sm:prose-base">
            {parse(cleanDeskripsi)}
          </div>
        </div>

        {!isPublicVisitor ? (
          <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5">
            <div className="space-y-1">
              <p className="body font-medium text-text-primary">Pendaftaran acara</p>
              <p className="footnote text-text-secondary">
                {isJoined
                  ? "Kamu sudah terdaftar. Gunakan tombol di samping untuk membatalkan."
                  : isClosed
                    ? deadlineCopy
                    : "Tekan dan tahan tombol di samping untuk mendaftar."}
              </p>
            </div>
            <EventActionButton event={data} sessionUserId={session?.user.id} />
          </section>
        ) : (
          <aside className="mt-10 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                <IconArrowUpRight className="size-4" aria-hidden />
              </span>
              <div className="space-y-1">
                <p className="body font-medium text-text-primary">
                  Ikuti acara di portal PPI Bartın
                </p>
                <p className="footnote text-text-secondary">
                  Masuk untuk melihat lokasi, mendaftar, dan mengakses detail lengkap.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Masuk
            </Link>
          </aside>
        )}

        <RelatedEvents currentSlug={data.slug} hrefBase={hrefBase} />
      </article>

      <Dialog open={isOpenImageDialog} onOpenChange={setIsOpenImageDialog}>
        <DialogPopup showCloseButton={false}>
          <Image
            src={imageUrl(data.fileKey)}
            alt={data.judul}
            height={200}
            width={200}
            className="z-0 w-full object-cover"
          />
          <DialogClose>
            <Button variant="outline" size="icon-xl" className="rounded-full">
              <IconX size={16} />
            </Button>
          </DialogClose>
        </DialogPopup>
      </Dialog>

      {!isPublicVisitor && (
        <AlertDEelete
          type="acara"
          id={data.id}
          href={hrefBase}
          open={isOpenAlert}
          onOpenChange={setIsOpenAlert}
          onClick={() => setIsOpenAlert(false)}
        />
      )}
    </>
  );
};
