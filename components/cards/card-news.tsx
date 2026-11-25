"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formattedDateNews } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";
import { TgetNews } from "@/server/data/news";
import { cn } from "@/lib/utils";
import {
  getNewsCategoryTone,
  newsCategoryDotStyles,
  newsCategoryToneStyles,
} from "@/utils/news-category";

export const FrameNews = memo(function FrameNews({
  hrefBase = "/berita",
  ...news
}: TgetNews & { hrefBase?: string }) {
  const categoryTone = getNewsCategoryTone(news.catagory);

  return (
    <Link
      href={`${hrefBase}/${news.slug}`}
      className="group flex w-full items-start gap-2.5 rounded-[10px] border border-border bg-surface p-3 text-left shadow-none transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {news.environment && news.environment !== "production" && (
          <div className="absolute left-1 top-1 z-10 rounded-[4px] bg-[rgba(0,0,0,.55)] px-1.5 py-[1px] font-mono text-[0.625rem] font-medium leading-[1.4] text-white backdrop-blur-[4px]">
            {news.environment === "local" ? "LOCAL" : "PREVIEW"}
          </div>
        )}
        <Image
          src={imageUrl(news.fileKey)}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          fill
          sizes="80px"
          alt=""
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div
          className={cn(
            "flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.05em]",
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
});
