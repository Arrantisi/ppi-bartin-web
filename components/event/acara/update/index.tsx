"use client";

import { useQuery } from "@tanstack/react-query";
import { UpdateEventContent } from "./content";
import { UpdateEventHeader } from "./header";
import { getEventBySlug } from "@/server/data/events";

export const UpdateEventComponent = ({ slug }: { slug: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["update_event", slug],
    queryFn: () => getEventBySlug(slug),
  });

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
