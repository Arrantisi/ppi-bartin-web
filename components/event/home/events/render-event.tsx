"use client";

import { useEvents } from "@/hooks/use-events";
import { SkeletonCardAcara } from "@/components/skeletons/card-event-skeleton";
import CardEvent from "@/components/cards/card-event";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";

export const RenderAcara = () => {
  const { data, isLoading } = useEvents();

  if (isLoading) {
    return <SkeletonCardAcara />;
  }

  if (!data || data.length === 0) {
    return <div>Event tidak ada</div>;
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
      <CarouselContent className="-ml-4">
        {data.slice(0, 3).map((event) => (
          <CarouselItem
            key={event.slug}
            className="pl-4 basis-[90%] md:basis-1/2 lg:basis-1/3"
          >
            <CardEvent {...event} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots />
    </Carousel>
  );
};
