"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconShare, IconBookmark } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getAcaraPreview } from "@/data/get-preview-acara";
import { formattedDate } from "@/utils/date-format";

export const EventPreviewComoponent = ({ slug }: { slug: string }) => {
  const { data } = useQuery({
    queryKey: ["getPreviewAcara"],
    queryFn: () => getAcaraPreview(slug),
  });

  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto bg-background min-h-screen pb-10">
      {/* Sticky Top Navigation */}
      <nav className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background shadow-2xl"
          onClick={() => router.back()}
        >
          <IconArrowLeft size={24} />
        </Button>
        <span className="font-bold text-lg bg-background shadow-2xl rounded-4xl p-2 px-3 capitalize">
          preview acara
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full  bg-background shadow-2xl"
          >
            <IconShare size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full  bg-background shadow-2xl"
          >
            <IconBookmark size={24} />
          </Button>
        </div>
      </nav>

      <div className="px-5">
        <div>
          <div className="flex items-center gap-3 mt-6">
            <Avatar className="size-10">
              <AvatarImage
                src={data?.creator.image || "/user-profile-02.png"}
              />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold capitalize">
                {data?.creator.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formattedDate(data?.date || new Date())}</span>
                <div className="size-1 rounded-full bg-muted-foreground" />
                <Badge
                  variant="secondary"
                  className="text-[10px] h-4 leading-none"
                >
                  Beasiswa
                </Badge>
              </div>
            </div>
          </div>
          <div></div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mt-4 leading-tight">
          {data?.judul}
        </h1>

        {/* Hero Image */}
        <div className="relative aspect-video w-full mt-6 overflow-hidden rounded-3xl shadow-lg">
          <Image
            src={"/prestasi-news.jpeg"}
            alt="Beasiswa Turki"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Bagian Article - Khusus Teks Beasiswa */}
        <article className="mt-8 px-5 max-w-2xl mx-auto">
          <div className="text-foreground/90 leading-relaxed whitespace-pre-line text-base md:text-lg tracking-wide">
            {data?.content}
          </div>

          <div className="mt-10 pt-6 border-t border-muted text-xs text-muted-foreground text-center">
            <p>
              Informasi lebih lanjut dapat diakses melalui website resmi YTB.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
