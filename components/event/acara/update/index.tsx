"use client";

import { UpdateAcaraField } from "@/components/field/update-acara";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { getEventBySlug } from "@/data/events";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export const UpdateEventComponent = ({ slug }: { slug: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["getEventPhoto"],
    queryFn: () => getEventBySlug(slug),
  });

  if (isLoading) {
    return (
      <AspectRatio ratio={4 / 3}>
        <Skeleton className="h-full w-full" />
      </AspectRatio>
    );
  }

  if (!data) {
    return <div>data tidak ada</div>;
  }

  return (
    <div className="space-y-3">
      <AspectRatio
        ratio={4 / 3}
        className="bg-muted rounded-4xl overflow-hidden border"
      >
        <Image
          src={data.images[0].url}
          alt="4:3"
          fill
          className="object-cover"
        />
      </AspectRatio>
      <UpdateAcaraField slug={slug} />
    </div>
  );
};
