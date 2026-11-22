"use client";

import { useMemo, useState } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { NewsCaratogorySkeleton } from "@/components/skeletons/news-catagory-skeleton";
import { FrameNews } from "@/components/cards/card-news";
import { useNews } from "@/hooks/use-news";
import { useClientList } from "@/hooks/use-client-list";
import { DataKosong } from "@/components/data-kosong";
import { ButtonCreate } from "@/components/buttons";
import { ContentPagination } from "@/components/shared/content-pagination";
import {
  ContentSearch,
  ContentSearchEmpty,
} from "@/components/shared/content-search";
import {
  getNewsCategoryTone,
  newsCategoryDotStyles,
} from "@/utils/news-category";
import type { TgetNews } from "@/server/data/news";

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

const getNewsSearchText = (news: TgetNews) =>
  `${news.judul} ${news.catagory} ${news.slug} ${news.desckripsi} ${news.creator.name}`;

const BeritaCatagory = () => {
  const { data, isLoading } = useNews();
  const [activeCategory, setActiveCategory] = useState("all");

  const categoryItems = useMemo(() => {
    if (!data) return [];
    return activeCategory === "all"
      ? data
      : data.filter((news) => news.catagory === activeCategory);
  }, [data, activeCategory]);

  const list = useClientList({
    items: categoryItems,
    getSearchText: getNewsSearchText,
    pageSize: 10,
  });

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
    return <DataKosong href="/home/berita/create" catagory="Berita" />;
  }

  return (
    <>
      <div className="flex items-center gap-2 mt-3">
        <ContentSearch
          value={list.query}
          onChange={list.setQuery}
          placeholder="Cari berita..."
          label="Cari berita"
        />
        <ButtonCreate catagory="berita" />
      </div>

      <Tabs
        value={activeCategory}
        onValueChange={(value) => {
          setActiveCategory(value);
          list.setPage(1);
        }}
        className="w-full mt-3"
      >
        {/* 1. Scrollable Tabs List */}
        <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-none">
          <TabsList className="bg-transparent h-auto p-0 gap-3 flex justify-start max-w-sm">
            {catagoryTrigger.map((item) => (
              <TabsTrigger
                key={item.ctg}
                value={item.ctg}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-6 py-2.5 capitalize transition-colors",
                  "data-[state=active]:border-accent/30 data-[state=active]:bg-accent/10 data-[state=active]:text-accent",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    newsCategoryDotStyles[
                      item.ctg === "all" ? "neutral" : getNewsCategoryTone(item.ctg)
                    ],
                  )}
                />
                {item.ctg}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* 2. Daftar sesuai kategori + pencarian + halaman aktif */}
        <TabsContent
          value={activeCategory}
          className="mt-0 grid grid-cols-1 xl:grid-cols-2 gap-3"
        >
          {list.pageItems.map((news) => (
            <FrameNews key={news.slug} {...news} />
          ))}
          {list.pageItems.length === 0 && (
            <ContentSearchEmpty
              query={list.query}
              label="berita"
              onReset={list.resetQuery}
            />
          )}
        </TabsContent>
      </Tabs>

      <ContentPagination
        page={list.page}
        totalPages={list.totalPages}
        onNavigate={list.setPage}
        label="Navigasi halaman berita"
      />
    </>
  );
};

export default BeritaCatagory;
