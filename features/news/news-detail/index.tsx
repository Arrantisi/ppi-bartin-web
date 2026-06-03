"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconDots } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formattedDate } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";
import { useNewsBySlug } from "@/hooks/use-news";
import { LoaderOneDemo } from "@/components/loader";
import { Drawer } from "@/components/ui/drawer";
import { authClient } from "@/lib/auth/client";
import { useState } from "react";
import { AlertDEelete } from "@/components/shared/confirm-delete-dialog";
import { DrawerOpsi } from "@/components/shared/content-actions-drawer";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { getTwoWords } from "@/utils/get-twowords";
import linkifyHtml from "linkify-html";

export const NewsDetailComponent = ({
  slug,
  readOnly = false,
}: {
  slug: string;
  readOnly?: boolean;
}) => {
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const isPublicVisitor = readOnly || !session;

  const { data, isLoading } = useNewsBySlug({ slug });
  if (isLoading) return <LoaderOneDemo />;
  if (!data)
    return <div className="p-10 text-center">data tidak di temukan</div>;

  const handleOpenDelete = () => {
    setIsOpenDrawer(false);
    setTimeout(() => setIsOpenAlert(true), 300);
  };

  // 1. DAFTARKAN HOOK DOMPURIFY DI LUAR KOMPONEN ATAU TEPAT SEBELUM SANITASI
  // Kita cek typeof window agar tidak error saat Next.js melakukan Server-Side Rendering (SSR)
  if (typeof window !== "undefined") {
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      if ("target" in node && node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  // 2. PROSES LINKIFY (Ubah teks URL mentah jadi tag <a>)
  const htmlWithLinks = linkifyHtml(data.desckripsi || "", {
    target: "_blank",
    attributes: {
      rel: "noopener noreferrer",
    },
    validate: {
      url: (value) => /^(http|https):\/\//.test(value) || value.includes("."),
    },
  });

  // 3. PROSES SANITASI DENGAN DOMPURIFY
  const clean = DOMPurify.sanitize(htmlWithLinks, {
    FORBID_ATTR: ["style", "font"],
    ADD_ATTR: ["target", "rel"],
  });
  return (
    <>
      <div className="detail-page max-w-2xl mx-auto bg-background min-h-screen pb-10 pt-3">
        {/* Top Navigation */}
        <div className="p-2 top-0 left-0 right-0 px-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon-xl"
            className="rounded-md"
            onClick={() => router.back()}
          >
            <IconArrowLeft size={20} />
          </Button>

          <h1 className="h-11 px-[calc(--spacing(4)-1px)] text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5 flex justify-center items-center rounded-4xl border border-border bg-background text-text-primary shadow-none">
            Berita
          </h1>

          <div className="flex gap-2">
            {!isPublicVisitor && (
              <Drawer open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
                <Button
                  variant={"outline"}
                  size={"icon-xl"}
                  className="rounded-full"
                  onClick={() => setIsOpenDrawer(true)}
                >
                  <IconDots />
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

        <div className="px-5">
          {/* Author & Meta */}
          <div className="flex items-center gap-3 mt-6">
            <Avatar className="size-10">
              <AvatarImage src={data.creator.image || ""} />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="body text-text-primary font-semibold capitalize">
                {getTwoWords(data.creator.name!)}
              </p>
              <div className="flex items-center gap-2 footnote text-text-secondary">
                <span>{formattedDate(data.createdAt)}</span>
                <div className="size-1 rounded-full bg-muted-foreground" />
                <span className="mono text-xs text-text-disabled uppercase tracking-wider">
                  {data.catagory}
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="title-satu mt-4 text-text-primary">{data.judul}</h1>

          {/* Hero Image */}
          <div className="w-full mt-5 overflow-hidden rounded-lg border border-border">
            <Image
              src={imageUrl(data.fileKey)}
              alt="Berita"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Article */}
          <article className="mt-8 mx-auto">
            <div className="detail-page relative py-3 border-y border-border max-w-full body wrap-anywhere my-4 prose prose-sm dark:prose-invert prose-neutral prose-headings:font-semibold prose-p:text-[--text-secondary] prose-strong:text-[--text-primary] prose-a:text-[--accent] prose-img:rounded-[10px] [&_p]:block [&_strong]:text-text-primary">
              {parse(clean)}
            </div>
          </article>

          {!isPublicVisitor ? (
            <div></div>
          ) : (
            <div className="w-full rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              Anda mengakses laman publik Portal PPI Bartin.{" "}
              <a href="/login" className="text-primary hover:underline">
                Masuk</a>{" "}untuk lebih lanjut.
            </div>
          )}
        </div>
      </div>

      {/* AlertDEelete di luar semua portal — dikontrol via state */}
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
