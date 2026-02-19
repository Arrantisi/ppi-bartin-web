"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { getNews } from "@/data/news";
import { supabase } from "@/lib/supabase";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { NewsCaratogorySkeleton } from "../skeleton/news-catagory-skeleton";
import { formattedDate } from "@/utils/date-format";
import { Badge } from "../ui/badge";

const CardBeritaTerbaru = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["getAllNews"],
    queryFn: () => getNews(),
  });

  useEffect(() => {
    const channel = supabase
      .channel("get_all_news")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "news" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getAllNews"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "images" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getAllNews"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getAllNews"] });
        },
      )
      .subscribe((status) => {
        console.log(status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (!data || data.length < 0) {
    return <div>Berita tidak ada</div>;
  }

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, idx) => (
          <NewsCaratogorySkeleton key={idx} />
        ))}
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, idx) => (
          <NewsCaratogorySkeleton key={idx} />
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-col items-start gap-3 my-3 ">
      {data.map((news) => (
        <Link
          href={`/home/news/${news.slug}`}
          key={news.slug}
          className="grid grid-cols-5 w-full hover:bg-muted-foreground/5 p-2 rounded-4xl gap-2"
        >
          <Image
            src={news.images[0].url}
            alt="berita"
            height={200}
            width={200}
            className="size-36 rounded-4xl col-span-2"
          />

          <div className="flex flex-col items-start justify-between h-36 col-span-3">
            <div className="space-y-1">
              <Badge size={"sm"} className="text-xs rounded-2xl capitalize">
                {" "}
                <div className="size-2 rounded-full bg-accent" />
                {news.catagory}
              </Badge>
              <h1 className="text-lg/6 font-semibold line-clamp-2">
                {news.judul}
              </h1>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1">
                <Avatar className="size-6">
                  <AvatarImage src={news.creator.image || ""} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-xs">{news.creator.username || ""}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-2 bg-muted-foreground rounded-full" />
                <span className="text-xs text-muted-foreground">
                  {formattedDate(news.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CardBeritaTerbaru;
