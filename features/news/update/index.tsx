"use client";

import { LoaderOneDemo } from "@/components/loader";
import { UpdateNewsContent } from "./content";
import { useNewsBySlug } from "@/hooks/use-news";

export const UpdateNewsComponent = ({
  slug,
  backHref = "/home/berita",
}: {
  slug: string;
  backHref?: string;
}) => {
  const { data, isLoading } = useNewsBySlug({ slug });

  if (isLoading) {
    return <LoaderOneDemo />;
  }

  if (!data) {
    return <div>Berita tidak di temukan</div>;
  }

  return (
    <UpdateNewsContent slug={slug} data={data} backHref={backHref} />
  );
};
