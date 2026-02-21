/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNews } from "@/data/news";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { formattedDate } from "@/utils/date-format";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsCaratogorySkeleton } from "@/components/skeleton/news-catagory-skeleton";

const catagoryTrigger = [
  { ctg: "all" },
  { ctg: "beasiswa" },
  { ctg: "kegiatan" },
  { ctg: "pengumuman" },
];

const BeritaCatagory = () => {
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
        { event: "*", schema: "public", table: "participants" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getAllNews"] });
        },
      )
      .subscribe((status) => {
        console.log("berita-catagory", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, idx) => (
          <NewsCaratogorySkeleton key={idx} />
        ))}
      </>
    );
  }

  if (!data || data.length < 0) {
    return <div>Berita tidak ada</div>;
  }

  return (
    <Tabs defaultValue="all" className="w-full my-3">
      {/* 1. Scrollable Tabs List */}
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <TabsList className="bg-transparent h-auto p-0 gap-3 flex justify-start">
          {catagoryTrigger.map((item) => (
            <TabsTrigger
              key={item.ctg}
              value={item.ctg}
              className={cn(
                "rounded-full bg-muted px-6 py-2.5 capitalize transition-all",
                "data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md",
              )}
            >
              {item.ctg}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      {/* 2. Mapping Content berdasarkan Kategori */}
      {catagoryTrigger.map((category) => (
        <TabsContent key={category.ctg} value={category.ctg} className="mt-4">
          {data
            .filter((news) =>
              category.ctg === "all" ? true : news.catagory === category.ctg,
            )
            .filter((news) => news.status === "PUSBLISH")
            .map((news) => (
              <Link
                href={`/home/news/${news.slug}`}
                key={news.slug}
                className="grid grid-cols-5 w-full hover:bg-muted-foreground/5 p-2 rounded-4xl gap-2"
              >
                <Image
                  src={news.images[0]?.url}
                  alt="berita"
                  height={200}
                  width={200}
                  className="size-36 rounded-4xl col-span-2"
                />

                <div className="flex flex-col items-start justify-between h-36 col-span-3">
                  <div className="space-y-1">
                    <Badge
                      size={"sm"}
                      className="text-xs rounded-2xl capitalize"
                    >
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
                      <span className="text-xs">
                        {news.creator.username || ""}
                      </span>
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
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default BeritaCatagory;
