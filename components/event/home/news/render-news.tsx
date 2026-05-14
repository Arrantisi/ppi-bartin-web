"use client";

import { useNews } from "@/hooks/use-news";
import { NewsCaratogorySkeleton } from "@/components/skeletons/news-catagory-skeleton";
import { FrameNews } from "@/components/cards/card-news";
import { DataKosong } from "@/components/data-kosong";

export const RenderNews = () => {
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
    return <DataKosong href="/home/news/create" catagory="Berita" />;
  }
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
      {data.slice(0, 6).map((news) => {
        return <FrameNews {...news} key={news.slug} />;
      })}
    </div>
  );
};
