"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";

import { useNews } from "@/hooks/use-news";
import { formattedDateNews } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";
import { cn } from "@/lib/utils";
import {
  getNewsCategoryTone,
  newsCategoryDotStyles,
  newsCategoryToneStyles,
} from "@/utils/news-category";

export function RelatedNews({
  currentSlug,
  category,
  hrefBase,
}: {
  currentSlug: string;
  category: string;
  hrefBase: string;
}) {
  const { data } = useNews();

  const related = useMemo(() => {
    if (!data) return [];
    const others = data.filter((news) => news.slug !== currentSlug);
    const sameCategory = others.filter((news) => news.catagory === category);
    return (sameCategory.length > 0 ? sameCategory : others).slice(0, 3);
  }, [data, currentSlug, category]);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="subheadline text-text-primary">Berita lainnya</h2>
        <Link
          href={hrefBase}
          className="inline-flex shrink-0 items-center gap-1 text-[0.8125rem] text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring"
        >
          Lihat semua
          <IconArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {related.map((news) => {
          const tone = getNewsCategoryTone(news.catagory);

          return (
            <Link
              key={news.slug}
              href={`${hrefBase}/${news.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <Image
                  src={imageUrl(news.fileKey)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-3">
                <div
                  className={cn(
                    "flex items-center gap-1.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em]",
                    newsCategoryToneStyles[tone],
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      newsCategoryDotStyles[tone],
                    )}
                  />
                  {news.catagory}
                </div>
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary">
                  {news.judul}
                </p>
                <p className="font-mono text-[0.6875rem] text-text-disabled">
                  {formattedDateNews(news.createdAt)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
