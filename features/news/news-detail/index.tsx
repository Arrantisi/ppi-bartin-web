"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import linkifyHtml from "linkify-html";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconChevronRight,
  IconClock,
  IconDots,
  IconNewsOff,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { LoaderOneDemo } from "@/components/loader";
import { SharePopover } from "@/components/shared/share-popover";
import { AlertDEelete } from "@/components/shared/confirm-delete-dialog";
import { DrawerOpsi } from "@/components/shared/content-actions-drawer";
import { RelatedNews } from "./related-news";
import { useNewsBySlug } from "@/hooks/use-news";
import type { TgetNewsBySlug } from "@/server/data/news";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { formattedDate } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";
import { getTwoWords } from "@/utils/get-twowords";
import {
  getNewsCategoryTone,
  newsCategoryDotStyles,
  newsCategoryToneStyles,
} from "@/utils/news-category";

export const NewsDetailComponent = ({
  slug,
  readOnly = false,
  initialData,
}: {
  slug: string;
  readOnly?: boolean;
  initialData?: TgetNewsBySlug;
}) => {
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const { data: session } = authClient.useSession();
  const isPublicVisitor = readOnly || !session;
  const hrefBase = isPublicVisitor ? "/berita" : "/home/berita";

  const { data, isLoading } = useNewsBySlug({ slug, initialData });

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

  const categoryTone = getNewsCategoryTone(data?.catagory);

  const clean = useMemo(() => {
    const htmlWithLinks = linkifyHtml(data?.desckripsi || "", {
      target: "_blank",
      attributes: {
        rel: "noopener noreferrer",
      },
      validate: {
        url: (value) => /^(http|https):\/\//.test(value) || value.includes("."),
      },
    });

    return DOMPurify.sanitize(htmlWithLinks, {
      FORBID_ATTR: ["style", "font"],
      ADD_ATTR: ["target", "rel"],
    });
  }, [data?.desckripsi]);

  if (isLoading) return <LoaderOneDemo />;

  if (!data) {
    return (
      <div className="mx-auto flex min-h-[60svh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full border border-border bg-surface text-text-secondary">
          <IconNewsOff className="size-8" aria-hidden />
        </div>
        <h1 className="title-tiga text-text-primary">Berita tidak ditemukan</h1>
        <p className="body text-text-secondary">
          Berita dengan tautan ini mungkin sudah dihapus atau tidak tersedia.
        </p>
        <Link href={hrefBase} className={buttonVariants({ variant: "outline" })}>
          <IconArrowLeft aria-hidden />
          Kembali ke berita
        </Link>
      </div>
    );
  }

  const wordCount = data.desckripsi
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handleOpenDelete = () => {
    setIsOpenDrawer(false);
    setTimeout(() => setIsOpenAlert(true), 300);
  };

  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-5 pb-16 pt-8 md:px-6">
        {/* Breadcrumb ringan, menggantikan bar navigasi dobel */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[0.8125rem] text-text-secondary"
        >
          <Link
            href={hrefBase}
            className="inline-flex items-center gap-1.5 rounded-sm transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring"
          >
            <IconArrowLeft className="size-4" aria-hidden />
            Berita
          </Link>
          <IconChevronRight
            className="size-3.5 shrink-0 text-text-disabled"
            aria-hidden
          />
          <span className="truncate text-text-disabled capitalize">
            {data.catagory}
          </span>
        </nav>

        <header className="mt-8 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em]",
                newsCategoryToneStyles[categoryTone],
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  newsCategoryDotStyles[categoryTone],
                )}
              />
              {data.catagory}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.75rem] text-text-disabled">
              <IconClock className="size-3.5" aria-hidden />
              {readingMinutes} menit baca
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
                    title="berita"
                    onDelete={handleOpenDelete}
                  />
                </Drawer>
              )}
            </div>
          </div>
        </header>

        <figure className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface">
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
        </figure>

        <div className="detail-page prose prose-sm mt-10 max-w-none wrap-anywhere dark:prose-invert prose-neutral prose-headings:font-semibold prose-headings:text-text-primary prose-p:text-[--text-secondary] prose-strong:text-[--text-primary] prose-a:text-[--accent] prose-img:rounded-2xl [&_p]:block [&_strong]:text-text-primary sm:prose-base">
          {parse(clean)}
        </div>

        {isPublicVisitor && (
          <aside className="mt-10 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                <IconArrowUpRight className="size-4" aria-hidden />
              </span>
              <div className="space-y-1">
                <p className="body font-medium text-text-primary">
                  Lanjutkan di portal PPI Bartın
                </p>
                <p className="footnote text-text-secondary">
                  Masuk untuk mengakses fitur portal dan melihat berita lainnya.
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

        <RelatedNews
          currentSlug={data.slug}
          category={data.catagory}
          hrefBase={hrefBase}
        />
      </article>

      {!isPublicVisitor && (
        <AlertDEelete
          href="/berita"
          type="berita"
          id={data.id}
          open={isOpenAlert}
          onOpenChange={setIsOpenAlert}
          onClick={() => setIsOpenAlert(false)}
        />
      )}
    </>
  );
};
