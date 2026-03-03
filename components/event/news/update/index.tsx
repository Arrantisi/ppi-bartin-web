"use client";

import { UpdateNewsContent } from "./content";
import { UpdateNewsHeader } from "./header";
import { UseNewsBySlug } from "@/hooks/use-news";

export const UpdateNewsComponent = ({ slug }: { slug: string }) => {
  const { data, isLoading } = UseNewsBySlug({ slug });

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
