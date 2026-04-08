"use client";

import { LoaderOneDemo } from "@/components/loader";
import { UpdateNewsContent } from "./content";
import { useNewsBySlug } from "@/hooks/use-news";
import { ButtonHeaderField } from "@/components/buttons";

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
      <ButtonHeaderField href="/home/news" label="Edit Berita" />
      <UpdateNewsContent slug={slug} data={data} />
    </div>
  );
};
