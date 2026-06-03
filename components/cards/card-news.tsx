"use client";

import Image from "next/image";
import Link from "next/link";
import { formattedDateNews } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";
import { TgetNews } from "@/server/data/news";

export const FrameNews = ({
  hrefBase = "/berita",
  ...news
}: TgetNews & { hrefBase?: string }) => {
  return (
    <Link
      href={`${hrefBase}/${news.slug}`}
      key={news.slug}
      className="flex w-full items-start gap-2.5 rounded-[10px] border border-border bg-surface p-3 text-left shadow-none"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {news.environment && news.environment !== "production" && (
          <div className="absolute left-1 top-1 z-10 rounded-[4px] bg-[rgba(0,0,0,.55)] px-1.5 py-[1px] font-mono text-[0.625rem] font-medium leading-[1.4] text-white backdrop-blur-[4px]">
            {news.environment === "local" ? "LOCAL" : "PREVIEW"}
          </div>
        )}
        <Image
          src={imageUrl(news.fileKey)}
          className="object-cover"
          fill
          sizes="80px"
          alt=""
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.05em] text-text-disabled">
          {news.catagory}
        </div>
        <div className="line-clamp-2 text-[0.875rem] font-semibold leading-[1.35] tracking-[-0.01em] text-text-primary">
          {news.judul}
        </div>
        <div className="font-mono text-[0.75rem] font-normal text-text-disabled">
          {formattedDateNews(news.createdAt)}
        </div>
      </div>
    </Link>
  );
};
