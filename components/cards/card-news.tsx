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
  variant = "compact",
  ...news
}: TgetNews & {
  hrefBase?: string;
  variant?: "compact" | "featured";
}) {
  const categoryTone = getNewsCategoryTone(news.catagory);
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`${hrefBase}/${news.slug}`}
      className={cn(
        "group flex w-full overflow-hidden border border-border bg-surface text-left shadow-none transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring",
        isFeatured
          ? "flex-col rounded-2xl"
          : "items-start gap-2.5 rounded-[10px] p-3",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-muted",
          isFeatured
            ? "aspect-[16/9] w-full rounded-t-2xl"
            : "size-20 rounded-lg",
        )}
      >
        {news.environment && news.environment !== "production" && (
          <div className="absolute left-1 top-1 z-10 rounded-[4px] bg-[rgba(0,0,0,.55)] px-1.5 py-[1px] font-mono text-[0.625rem] font-medium leading-[1.4] text-white backdrop-blur-[4px]">
            {news.environment === "local" ? "LOCAL" : "PREVIEW"}
          </div>
        )}
        <Image
          src={imageUrl(news.fileKey)}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          fill
          sizes={isFeatured ? "(max-width: 768px) 100vw, 640px" : "80px"}
          alt=""
        />
      </div>

      <div
        className={cn(
          "min-w-0 flex-1",
          isFeatured ? "space-y-2 p-4" : "space-y-1.5",
        )}
      >
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
        <div
          className={cn(
            "line-clamp-2 font-semibold tracking-[-0.01em] text-text-primary",
            isFeatured
              ? "text-lg leading-snug md:text-xl"
              : "text-[0.875rem] leading-[1.35]",
          )}
        >
          {news.judul}
        </div>
        <div className="font-mono text-[0.75rem] font-normal text-text-disabled">
          {formattedDateNews(news.createdAt)}
        </div>
      </div>
    </Link>
  );
});
