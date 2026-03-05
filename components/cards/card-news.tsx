"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formattedDate } from "@/utils/date-format";
import { Badge } from "@/components/ui/badge";
import { imageUrl } from "@/utils/image-url";
import { TgetNews } from "@/server/data/news";

export const CardNewsRender = ({ ...news }: TgetNews) => {
  return (
    <div className="items-start gap-3">
      <Link
        href={`/home/news/${news.slug}`}
        key={news.slug}
        className="grid grid-cols-4 items-center w-full hover:bg-card rounded-4xl ring ring-accent bg-background"
      >
        <Image
          src={imageUrl(news.fileKey)}
          alt="berita"
          height={200}
          width={200}
          className="h-26 w-32 rounded-l-4xl col-span-1"
        />

        <div className="flex flex-col items-start justify-between h-24 w-full mx-4 col-span-3">
          <div className="space-y-1">
            <Badge size={"sm"} className="text-xs rounded-2xl capitalize">
              <span className="size-2 rounded-full bg-primary-foreground" />
              {news.catagory}
            </Badge>
            <h1 className="text-lg/6 font-semibold line-clamp-2">
              {news.judul}
            </h1>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              <Avatar className="size-6">
                <AvatarImage src={news.creator.image || ""} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-xs">{news.creator.username || ""}</span>
            </div>
            <div className="flex items-center gap-1 mx-2">
              <span className="size-2 bg-muted-foreground rounded-full" />
              <span className="text-xs text-muted-foreground">
                {formattedDate(news.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
