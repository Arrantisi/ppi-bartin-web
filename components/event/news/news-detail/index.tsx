"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconDots,
  IconCopy,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formattedDate } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";
import { useNewsBySlug } from "@/hooks/use-news";
import { LoaderOneDemo } from "@/components/loader";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/components/animate-ui/components/base/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { AlertDEelete } from "../../alert-delete";
import { goeyToast } from "@/components/ui/goey-toaster";

export const NewsDetailComponent = ({ slug }: { slug: string }) => {
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const router = useRouter();

  const { data: session } = authClient.useSession();
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

  const { data, isLoading } = useNewsBySlug({ slug });
  if (isLoading) {
    return <LoaderOneDemo />;
  }
  if (!data) {
    return <div>data tidak di temukan</div>;
  }

  return (
    <AlertDialog open={isOpenAlert} onOpenChange={setIsOpenAlert}>
      <div className="max-w-2xl mx-auto bg-background min-h-screen pb-10 pt-3">
        {/* Sticky Top Navigation */}
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
            Berita
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
                  <DrawerTitle className="text-center text-sm font-medium text-muted-foreground mb-4">
                    Opsi Acara
                  </DrawerTitle>

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
                          <IconEdit size={20} /> Edit Berita
                        </Button>
                      </Link>

                      <AlertDialogTrigger
                        className={buttonVariants({
                          variant: "ghost",
                          className:
                            "w-full justify-start gap-3 rounded-xl bg-destructive/45 ring ring-destructive text-destructive",
                        })}
                      >
                        <IconTrash size={20} className="text-destructive" />
                        <span className="text-destructive">Hapus Berita</span>
                      </AlertDialogTrigger>
                    </>
                  )}
                </div>
              </DrawerContent>
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
              alt="Beasiswa Turki"
              height={100}
              width={500}
              className="object-cover h-[450px]"
              priority
            />
          </div>

          {/* Bagian Article - Khusus Teks Beasiswa */}
          <article className="mt-8 mx-auto">
            <div className="max-w-full text-foreground/90 text-[13px] leading-relaxed whitespace-pre-line wrap-anywhere md:text-lg tracking-wide">
              {(data.desckripsi || "").trim()}
            </div>
          </article>
        </div>
      </div>
      <AlertDEelete
        type="berita"
        id={data.id}
        onClick={() => setIsOpenAlert(false)}
      />
    </AlertDialog>
  );
};
