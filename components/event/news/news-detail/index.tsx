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
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { AlertDEelete } from "../../alert-delete";
import { DrawerOpsi } from "@/components/drawers/opsi";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";

export const NewsDetailComponent = ({ slug }: { slug: string }) => {
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const { data, isLoading } = useNewsBySlug({ slug });
  if (isLoading) return <LoaderOneDemo />;
  if (!data) return <div>data tidak di temukan</div>;

  const handleOpenDelete = () => {
    setIsOpenDrawer(false);
    setTimeout(() => setIsOpenAlert(true), 300);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto bg-background min-h-screen pb-10 pt-3">
        {/* Top Navigation */}
        <div className="p-2 top-0 left-0 right-0 px-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon-xl"
            className="rounded-full"
            onClick={() => router.push("/home/berita")}
          >
            <IconArrowLeft size={20} />
          </Button>

          <h1 className="h-11 px-[calc(--spacing(4)-1px)] text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5 flex justify-center items-center rounded-4xl border-input bg-background not-dark:bg-clip-padding text-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/6%)] dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:bg-accent/50 dark:[:hover,[data-pressed]]:bg-input/64">
            Berita
          </h1>

          <div className="flex gap-2">
            {/* Drawer dikontrol lewat state, bukan DrawerTrigger */}
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
        </div>

        <div className="px-5">
          {/* Author & Meta */}
          <div className="flex items-center gap-3 mt-6">
            <Avatar className="size-10">
              <AvatarImage src={data.creator.image || ""} />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold capitalize">
                {data.creator.username || ""}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formattedDate(data.createdAt)}</span>
                <div className="size-1 rounded-full bg-muted-foreground" />
                <Badge
                  variant="secondary"
                  className="text-[10px] h-4 leading-none"
                >
                  {data.catagory}
                </Badge>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mt-4 leading-tight">
            {data.judul}
          </h1>

          {/* Hero Image */}
          <div className="relative aspect-videomt-6 overflow-hidden rounded-3xl shadow-lg w-full mt-5">
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
            <div className="max-w-full text-foreground/90 text-[13px] leading-relaxed whitespace-pre-line wrap-anywhere md:text-lg tracking-wide">
              {parse(DOMPurify.sanitize(data.desckripsi || ""))}
            </div>
          </article>
        </div>
      </div>

      {/* AlertDEelete di luar semua portal — dikontrol via state */}
      <AlertDEelete
        href="/home/berita"
        type="berita"
        id={data.id}
        open={isOpenAlert}
        onOpenChange={setIsOpenAlert}
        onClick={() => setIsOpenAlert(false)}
      />
    </>
  );
};
