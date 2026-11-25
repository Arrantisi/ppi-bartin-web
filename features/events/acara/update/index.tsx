"use client";

import { LoaderOneDemo } from "@/components/loader";
import { UpdateEventContent } from "./content";
import { useEventBySlug } from "@/hooks/use-events";

export const UpdateEventComponent = ({
  slug,
  backHref = "/home/acara",
}: {
  slug: string;
  backHref?: string;
}) => {
  const { data, isLoading } = useEventBySlug({ slug });

  if (isLoading) {
    return <LoaderOneDemo />;
  }

  if (!data) {
    return <div>Data tidak di temukan</div>;
  }

  return (
    <UpdateEventContent slug={slug} data={data} backHref={backHref} />
  );
};
