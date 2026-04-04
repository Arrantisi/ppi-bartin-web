"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formattedDate } from "@/utils/date-format";
import { NewsCorouselSkelet } from "@/components/skeletons/news-corousel-skeleton";
import { imageUrl } from "@/utils/image-url";
import { useNews } from "@/hooks/use-news";

const CarouselCard = () => {
  const { data, isLoading } = useNews();

  if (isLoading) {
    return (
      <>
        <NewsCorouselSkelet />
      </>
    );
  }

  if (!data || data.length === 0) {
    return <div>Berita tidak ada</div>;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4 mt-4">
        {data
          .slice(0, 4)

          .map((news) => (
            <CarouselItem
              key={news.slug}
              className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3"
            >
              <div className="relative group overflow-hidden rounded-4xl h-70 w-full">
                {/* Image Background */}
                <Image
                  src={imageUrl(news.fileKey)}
                  alt="News"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content Context */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className=" flex justify-end">
                    <Badge shape={"circle"}>{news.catagory}</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/80">
                      <Avatar className="size-6">
                        <AvatarImage src={news.creator.image || ""} />
                        <AvatarFallback>VC</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium leading-none">
                          {news.creator.username || ""}
                        </span>
                        <div className="size-1.5 rounded-full bg-white/80" />
                        <span className="text-xs opacity-70">
                          {formattedDate(news.createdAt)}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-white text-lg font-bold leading-tight">
                      {news.judul}
                    </h2>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CarouselCard;
