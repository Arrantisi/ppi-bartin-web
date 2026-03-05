"use client";

import { useNews } from "@/hooks/use-news";
import { CardNewsRender } from "../../cards/card-news";
import { NewsCaratogorySkeleton } from "@/components/skeletons/news-catagory-skeleton";

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
        <CardNewsRender {...news} key={news.slug} />
      ))}
    </div>
  );
};
