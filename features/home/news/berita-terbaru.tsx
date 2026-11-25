import Link from "next/link";
import { IconArrowUpRight, IconNews } from "@tabler/icons-react";

import { RenderNews } from "./render-news";

const BeritaTerbaru = () => {
  return (
    <section className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-text-primary">
            <IconNews className="size-4" aria-hidden />
          </span>
          <h2 className="subheadline truncate text-text-primary">
            Berita terbaru
          </h2>
        </div>
        <Link
          href="/home/berita"
          className="inline-flex shrink-0 items-center gap-1 text-[0.8125rem] text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring"
        >
          Lihat lebih banyak
          <IconArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      <div className="min-w-0 flex-1">
        <RenderNews />
      </div>
    </section>
  );
};

export default BeritaTerbaru;
