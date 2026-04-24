"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formattedDateNews } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";
import { TgetNews } from "@/server/data/news";
import { cn } from "@/lib/utils";
import { categoryStyles } from "../event/color-catagory";

export const FrameNews = ({ ...news }: TgetNews) => {
  const dotColor = categoryStyles[news.catagory] || "bg-gray-400";

  return (
    <Link
      href={`/home/news/${news.slug}`}
      key={news.slug}
      className="w-full relative flex items-center p-[7px] box-border gap-[0.937rem] text-left text-[0.688rem] text-gray font-sf-pro bg-card shadow rounded-3xl "
    >
      <Image
        src={imageUrl(news.fileKey)}
        className="h-[8.438rem] w-37.5 relative rounded-[18px] object-cover shrink-0"
        width={150}
        height={135}
        sizes="100vw"
        alt=""
      />
      <div className="w-full flex flex-col items-start gap-1.5 justify-between h-full pb-2 pr-2">
        <div className="flex flex-col gap-1.5 w-full">
          <h3 className="text-[11px] text-foreground/70 uppercase flex items-center gap-2">
            <div className={cn("size-2 rounded-full", dotColor)} />{" "}
            {news.catagory}
          </h3>
          <div className="max-w-52 self-stretch relative text-[15px] tracking-[-0.23px] leading-5 font-semibold text-foreground">
            {news.judul}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[0.75rem] w-full">
          <Avatar className="size-6 ">
            <AvatarImage src={news.creator.image || ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex items-center w-full text-[12px]">
            <div className="w-full">{news.creator.username}</div>
            <div className="w-full text-right">
              {formattedDateNews(news.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
