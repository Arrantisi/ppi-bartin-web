"use client";

import { LoaderOneDemo } from "@/components/loader";
import { UpdateNewsContent } from "./content";
import { UpdateNewsHeader } from "./header";
import { useNewsBySlug } from "@/hooks/use-news";

export const UpdateNewsComponent = ({ slug }: { slug: string }) => {
  const { data, isLoading } = useNewsBySlug({ slug });

  if (isLoading) {
    return <LoaderOneDemo />;
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
