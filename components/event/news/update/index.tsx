"use client";

import { useQuery } from "@tanstack/react-query";
import { UpdateNewsContent } from "./content";
import { UpdateNewsHeader } from "./header";
import { getNewsBySlug } from "@/server/data/news";

export const UpdateNewsComponent = ({ slug }: { slug: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["update_news", slug],
    queryFn: () => getNewsBySlug(slug),
  });

  if (isLoading) {
    return <div>Memuat Berita</div>;
  }

  if (!data) {
    return <div>Berita tidak di temukan</div>;
  }

  return (
    <div>
      <UpdateNewsHeader />
      <UpdateNewsContent slug={slug} data={data} />
    </div>
  );
};
