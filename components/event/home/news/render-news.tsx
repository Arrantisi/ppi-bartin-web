"use client";

import { useNews } from "@/hooks/use-news";
import { NewsCaratogorySkeleton } from "@/components/skeletons/news-catagory-skeleton";
import { FrameNews } from "@/components/cards/card-news";

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
    return <div>Berita tidak ada</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.slice(0, 6).map((news) => (
        <FrameNews {...news} key={news.slug} />
      ))}
    </div>
  );
};
