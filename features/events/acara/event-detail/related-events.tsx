"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { IconArrowUpRight, IconCalendarWeek } from "@tabler/icons-react";

import { useEvents } from "@/hooks/use-events";
import { formatDateTime } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";

export function RelatedEvents({
  currentSlug,
  hrefBase,
}: {
  currentSlug: string;
  hrefBase: string;
}) {
  const { data } = useEvents();

  const related = useMemo(() => {
    if (!data) return [];
    const now = new Date().getTime();
    const time = (value: Date) => new Date(value).getTime();

    return data
      .filter((event) => event.slug !== currentSlug)
      .sort((a, b) => {
        const aUpcoming = time(a.date) >= now;
        const bUpcoming = time(b.date) >= now;
        if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
        return time(a.date) - time(b.date);
      })
      .slice(0, 3);
  }, [data, currentSlug]);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="subheadline text-text-primary">Acara lainnya</h2>
        <Link
          href={hrefBase}
          className="inline-flex shrink-0 items-center gap-1 text-[0.8125rem] text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring"
        >
          Lihat semua
          <IconArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {related.map((event) => {
          const rawDate = new Date(event.date);
          const metaDate =
            rawDate.getHours() === 0 && rawDate.getMinutes() === 0
              ? format(rawDate, "E, d LLL", { locale: id })
              : formatDateTime(rawDate);

          return (
            <Link
              key={event.id}
              href={`${hrefBase}/${event.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <Image
                  src={imageUrl(event.fileKey)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-3">
                <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-secondary">
                  Acara
                </p>
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary">
                  {event.judul}
                </p>
                <div className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-text-disabled">
                  <IconCalendarWeek className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{metaDate}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
