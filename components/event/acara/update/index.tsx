"use client";

import { UpdateEventContent } from "./content";
import { UpdateEventHeader } from "./header";
import { useEventBySlug } from "@/hooks/use-events";

export const UpdateEventComponent = ({ slug }: { slug: string }) => {
  const { data, isLoading } = useEventBySlug({ slug });

  if (isLoading) {
    return <div>Memuat Data</div>;
  }

  if (!data) {
    return <div>Data tidak di temukan</div>;
  }

  return (
    <div>
      <UpdateEventHeader />
      <UpdateEventContent slug={slug} data={data} />
    </div>
  );
};
