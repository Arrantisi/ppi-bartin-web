"use client";

import { useNews } from "@/hooks/use-news";
import { NewsCaratogorySkeleton } from "@/components/skeletons/news-catagory-skeleton";
import { FrameNews } from "@/components/cards/card-news";
import { DataKosong } from "@/components/data-kosong";

export const RenderNews = () => {
  const { data, isLoading } = useNews();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2.5">
        {Array.from({ length: 3 }).map((_, idx) => (
          <NewsCaratogorySkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <DataKosong href="/home/berita/create" catagory="Berita" />;
  }

  return (
    <div className="grid grid-cols-1 gap-2.5">
      {data.slice(0, 4).map((news) => (
        <FrameNews {...news} key={news.slug} />
      ))}
    </div>
  );
};
