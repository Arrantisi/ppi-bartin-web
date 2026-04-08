"use client";

import { LoaderOneDemo } from "@/components/loader";
import { UpdateEventContent } from "./content";
import { useEventBySlug } from "@/hooks/use-events";
import { ButtonHeaderField } from "@/components/buttons";

export const UpdateEventComponent = ({ slug }: { slug: string }) => {
  const { data, isLoading } = useEventBySlug({ slug });

  if (isLoading) {
    return <LoaderOneDemo />;
  }

  if (!data) {
    return <div>Data tidak di temukan</div>;
  }

  return (
    <div>
      <ButtonHeaderField href="/home/events" label="Edit Acara" />
      <UpdateEventContent slug={slug} data={data} />
    </div>
  );
};
