"use client";

import { useEventsHome } from "@/hooks/use-events";
import { SkeletonCardAcara } from "@/components/skeletons/card-event-skeleton";
import CardEvent from "@/components/cards/card-event";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { DataKosong } from "@/components/data-kosong";

export const RenderAcara = () => {
  const { data, isLoading } = useEventsHome();

  if (isLoading) {
    return <SkeletonCardAcara />;
  }

  if (!data || data.length === 0) {
    return <DataKosong href="/home/acara/create" catagory="Acara" />;
  }

  return (
    <Carousel
      autoplay
      autoplayDelay={10000}
      opts={{
        align: "start",
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-3">
        {data.slice(0, 3).map((event) => (
          <CarouselItem
            key={event.slug}
            className="basis-[92%] md:basis-1/2 pl-3"
          >
            <CardEvent {...event} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
