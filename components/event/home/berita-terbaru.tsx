"use client";

import Link from "next/link";
import { NewsCaratogorySkeleton } from "@/components/skeletons/news-catagory-skeleton";
import { CardNewsRender } from "./render-news";
import { useNews } from "@/hooks/use-news";

const BeritaTerbaru = () => {
  const { data, isLoading } = useNews();

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, idx) => (
          <NewsCaratogorySkeleton key={idx} />
        ))}
      </>
    );
  }

  if (!data || data.length === 0) {
    return <div>Berita tidak ada</div>;
  }
  return (
    <div className="mt-7 space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg tracking-tight capitalize">
          berita terbaru
        </h1>
        <Link
          href={"/home/news"}
          className="text-accent-foreground font-semibold text-sm"
        >
          selengkapnya
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.slice(0, 6).map((news) => (
          <CardNewsRender {...news} key={news.slug} />
        ))}
      </div>
    </div>
  );
};

export default BeritaTerbaru;
