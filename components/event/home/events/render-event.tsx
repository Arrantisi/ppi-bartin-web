"use client";

import { useEffect } from "react";

import { useEvents } from "@/hooks/use-events";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { SkeletonCardAcara } from "@/components/skeletons/card-event-skeleton";
import CardEvent from "@/components/cards/card-event";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";

export const RenderAcara = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useEvents();

  useEffect(() => {
    const channel = supabase
      .channel("events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participants" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events"] });
        },
      )
      .subscribe((status) => {
        console.log("home-event", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="block md:hidden">
                <CardEvent {...event} />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots />
    </Carousel>
  );
};
