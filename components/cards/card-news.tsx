"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formattedDateNews } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";
import { TgetNews } from "@/server/data/news";
import { cn } from "@/lib/utils";
import { categoryStyles } from "@/components/shared/category-styles";
import { getTwoWords } from "@/utils/get-twowords";

export const FrameNews = ({
  hrefBase = "/berita",
  ...news
}: TgetNews & { hrefBase?: string }) => {
  const dotColor = categoryStyles[news.catagory] || "bg-gray-400";

  return (
    <Link
      href={`${hrefBase}/${news.slug}`}
      key={news.slug}
      className="w-full relative flex items-center p-2 box-border gap-4 text-left bg-card rounded-2xl border border-border"
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
          <h3 className="subheadline flex items-center gap-2 text-text-disabled">
            <div className={cn("size-2 rounded-full", dotColor)} />{" "}
            {news.catagory}
          </h3>
          <div className="w-full self-stretch relative title-tiga">
            {news.judul}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full">
          <Avatar className="size-6 ">
            <AvatarImage src={news.creator.image || ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex items-center w-full footnote">
            <div className="w-full text-text-primary font-medium">{getTwoWords(news.creator.name!)}</div>
            <div className="w-full text-right text-text-disabled">
              {formattedDateNews(news.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
