"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { NewsCaratogorySkeleton } from "@/components/skeletons/news-catagory-skeleton";
import { FrameNews } from "../../cards/card-news";
import { useNews } from "@/hooks/use-news";

const catagoryTrigger = [
  { ctg: "all" },
  { ctg: "beasiswa" },
  { ctg: "kegiatan" },
  { ctg: "pengumuman" },
];

const BeritaCatagory = () => {
  const { data, isLoading } = useNews();

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, idx) => (
          <NewsCaratogorySkeleton key={idx} />
        ))}
      </>
    );
  }

  if (!data || data.length === 0) {
    return <div>berita belum update</div>;
  }

  return (
    <Tabs defaultValue="all" className="w-full mt-3">
      {/* 1. Scrollable Tabs List */}
      <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-none">
        <TabsList className="bg-transparent h-auto p-0 gap-3 flex justify-start w-max">
          {catagoryTrigger.map((item) => (
            <TabsTrigger
              key={item.ctg}
              value={item.ctg}
              className={cn(
                "rounded-full bg-muted px-6 py-2.5 capitalize transition-all",
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md",
                "dark:data-[state=active]:bg-accent-foreground dark:data-[state=active]:text-accent dark:data-[state=active]:shadow-md",
              )}
            >
              {item.ctg}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* 2. Mapping Content berdasarkan Kategori */}
      {catagoryTrigger.map((category) => (
        <TabsContent
          key={category.ctg}
          value={category.ctg}
          className="mt-0 grid grid-cols-1 md:grid-cols-2"
        >
          {data
            .filter((news) =>
              category.ctg === "all" ? true : news.catagory === category.ctg,
            )
            .map((news) => (
              <FrameNews key={news.slug} {...news} />
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default BeritaCatagory;
