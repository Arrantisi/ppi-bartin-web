"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { NewsCaratogorySkeleton } from "@/components/skeletons/news-catagory-skeleton";
import { FrameNews } from "@/components/cards/card-news";
import { useNews } from "@/hooks/use-news";
import { DataKosong } from "@/components/data-kosong";
import { ButtonCreate } from "@/components/buttons";
import { useMemo, useTransition } from "react";

const catagoryTrigger = [
  { ctg: "all" },
  // --- KATEGORI ACARA/KEGIATAN ---
  { ctg: "beasiswa" }, // Info beasiswa (YTB, kampus, dll)
  { ctg: "kegiatan" }, // Event yang akan datang (Makrab, Futsal)

  // --- KATEGORI BERITA/INFO ---
  { ctg: "berita-utama" }, // Berita penting/headline PPI
  { ctg: "kabar-kampus" }, // Berita seputar Bartın Üniversitesi
  { ctg: "prestasi" }, // Berita mahasiswa berprestasi di Bartin
  { ctg: "artikel" }, // Tulisan edukatif atau opini mahasiswa

  // --- KATEGORI UMUM ---
  { ctg: "pengumuman" }, // Urgent (Verifikasi, admin, dll)
];

const BeritaCatagory = () => {
  const { data, isLoading } = useNews();
  const [isPending, startTransition] = useTransition();

  const filteredMap = useMemo(() => {
    if (!data) return null;
    const map = new Map<string, typeof data>();
    for (const category of catagoryTrigger) {
      const filtered = category.ctg === "all"
        ? data
        : data.filter((news) => news.catagory === category.ctg);
      map.set(category.ctg, filtered);
    }
    return map;
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <NewsCaratogorySkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <DataKosong href="/home/news/create" catagory="Berita" />;
  }

  return (
    <>
      <div className="flex items-center gap-2 mt-3">
        <div className="h-10.5 w-full bg-card rounded-full border border-border" />

        <ButtonCreate catagory="berita" />
      </div>
      <Tabs defaultValue="all" className="w-full mt-3">
        {/* 1. Scrollable Tabs List */}
        <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-none">
          <TabsList className="bg-transparent h-auto p-0 gap-3 flex justify-start max-w-sm">
            {catagoryTrigger.map((item) => (
              <TabsTrigger
                key={item.ctg}
                value={item.ctg}
                onClick={() => startTransition(() => {})}
                className={cn(
                  "rounded-full border border-border bg-surface px-6 py-2.5 capitalize transition-colors",
                  "data-[state=active]:bg-surface-active data-[state=active]:text-text-primary",
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
            className={`mt-0 grid grid-cols-1 xl:grid-cols-2 gap-3 ${isPending ? "opacity-60" : ""}`}
          >
            {filteredMap?.get(category.ctg)?.map((news) => (
              <FrameNews key={news.slug} {...news} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default BeritaCatagory;
