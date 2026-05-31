"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconDots } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
  const isReadOnly = readOnly || !session;

  const { data, isLoading } = useNewsBySlug({ slug });
  if (isLoading) return <LoaderOneDemo />;
  if (!data) return <div className="p-10 text-center">data tidak di temukan</div>;

  const handleOpenDelete = () => {
    setIsOpenDrawer(false);
    setTimeout(() => setIsOpenAlert(true), 300);
  };

  const clean = DOMPurify.sanitize(data.desckripsi, {
    FORBID_ATTR: ["style", "font"], // ← strip style attribute
  });

  return (
    <>
      <div className="detail-page max-w-2xl mx-auto bg-background min-h-screen pb-10 pt-3">
        {/* Top Navigation */}
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
            Berita
          </h1>

          {!isReadOnly && (
            <div className="flex gap-2">
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
            </div>
          )}
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
                <Badge
                  variant="secondary"
                  className="subheadline h-4 leading-none"
                >
                  {data.catagory}
                </Badge>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="title-satu mt-4 text-text-primary">
            {data.judul}
          </h1>

          {/* Hero Image */}
          <div className="relative aspect-videomt-6 overflow-hidden rounded-3xl border border-border shadow-sm w-full mt-5">
            <Image
              src={imageUrl(data.fileKey)}
              alt="Berita"
              width={500}
              height={1000}
              className="object-cover"
              priority
            />
          </div>

          {/* Article */}
          <article className="mt-8 mx-auto">
            <div className="detail-page relative py-3 border-y border-border max-w-full body wrap-anywhere my-4 prose prose-sm dark:prose-invert prose-neutral prose-headings:font-semibold prose-p:text-[--text-secondary] prose-strong:text-[--text-primary] prose-a:text-[--accent] prose-img:rounded-[10px] max-w-none [&_p]:block [&_strong]:text-text-primary">
              {parse(clean)}
            </div>
          </article>
        </div>
      </div>

      {/* AlertDEelete di luar semua portal — dikontrol via state */}
      {!isReadOnly && (
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

