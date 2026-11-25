import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";

import { FrameNews } from "@/components/cards/card-news";
import { cn } from "@/lib/utils";
import type { TgetNews } from "@/server/data/news";
import { formattedDateNews } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";
import { toMetaDescription } from "@/utils/meta-description";
import {
  getNewsCategoryTone,
  newsCategoryDotStyles,
  newsCategoryToneStyles,
} from "@/utils/news-category";

function CategoryLabel({ category, className }: { category: string; className?: string }) {
  const tone = getNewsCategoryTone(category);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.05em]",
        newsCategoryToneStyles[tone],
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", newsCategoryDotStyles[tone])} />
      {category}
    </span>
  );
}

function EnvironmentBadge({ environment }: { environment: TgetNews["environment"] }) {
  if (!environment || environment === "production") return null;

  return (
    <span className="absolute left-2 top-2 z-10 rounded-[4px] bg-[rgba(0,0,0,.55)] px-1.5 py-[1px] font-mono text-[0.625rem] font-medium leading-[1.4] text-white backdrop-blur-[4px]">
      {environment === "local" ? "LOCAL" : "PREVIEW"}
    </span>
  );
}

function NewsHero({ news, hrefBase }: { news: TgetNews; hrefBase: string }) {
  const excerpt = toMetaDescription(news.desckripsi, 150);

  return (
    <Link
      href={`${hrefBase}/${news.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-none transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted lg:aspect-[16/10]">
        <EnvironmentBadge environment={news.environment} />
        <Image
          src={imageUrl(news.fileKey)}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <CategoryLabel category={news.catagory} />
          <span className="font-mono text-[0.75rem] font-normal text-text-disabled">
            {formattedDateNews(news.createdAt)}
          </span>
        </div>

        <h2 className="text-2xl font-semibold leading-snug tracking-[-0.02em] text-text-primary md:text-3xl">
          {news.judul}
        </h2>

        {excerpt && (
          <p className="body line-clamp-2 text-text-secondary">{excerpt}</p>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.8125rem] font-medium text-text-primary">
          Baca selengkapnya
          <IconArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

function NewsLatestList({
  items,
  hrefBase,
}: {
  items: TgetNews[];
  hrefBase: string;
}) {
  return (
    <aside className="rounded-3xl border border-border bg-surface p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="subheadline text-text-primary">Terbaru</h2>
        <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-disabled">
          {items.length} artikel
        </span>
      </div>

      <ol className="mt-3">
        {items.map((news, index) => (
          <li key={news.slug} className="border-t border-border">
            <Link
              href={`${hrefBase}/${news.slug}`}
              className="group flex gap-3 py-3 transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span
                aria-hidden
                className="pt-0.5 font-mono text-[0.6875rem] text-text-disabled"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <CategoryLabel category={news.catagory} />
                <h3 className="line-clamp-2 text-[0.875rem] font-medium leading-snug text-text-primary">
                  {news.judul}
                </h3>
                <span className="block font-mono text-[0.6875rem] font-normal text-text-disabled">
                  {formattedDateNews(news.createdAt)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/** Layout editorial daftar berita: satu sorotan utama, daftar terbaru, lalu grid sisanya. */
export function NewsEditorial({
  items,
  hrefBase,
  sidebarCount = 3,
}: {
  items: TgetNews[];
  hrefBase: string;
  sidebarCount?: number;
}) {
  const [hero, ...rest] = items;

  if (!hero) return null;

  const sidebar = rest.slice(0, sidebarCount);
  const grid = rest.slice(sidebarCount);

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "grid grid-cols-1 gap-5",
          sidebar.length > 0
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]"
            : "lg:grid-cols-1",
        )}
      >
        <NewsHero news={hero} hrefBase={hrefBase} />
        {sidebar.length > 0 && (
          <NewsLatestList items={sidebar} hrefBase={hrefBase} />
        )}
      </div>

      {grid.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {grid.map((news) => (
            <FrameNews key={news.slug} {...news} hrefBase={hrefBase} />
          ))}
        </div>
      )}
    </div>
  );
}
