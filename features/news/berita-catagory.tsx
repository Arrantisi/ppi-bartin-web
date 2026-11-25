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
import { NewsEditorial } from "@/components/shared/news-editorial";
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <NewsCaratogorySkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <DataKosong href="/home/berita/create" catagory="Berita" />;
  }

  const showEditorial =
    !list.query && activeCategory === "all" && list.pageItems.length > 0;

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
        className="mt-4 w-full"
      >
        <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-none">
          <TabsList className="flex h-auto w-max gap-1 rounded-full border border-border bg-surface p-1">
            {catagoryTrigger.map((item) => (
              <TabsTrigger
                key={item.ctg}
                value={item.ctg}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 capitalize transition-colors",
                  "data-[state=active]:bg-surface-active data-[state=active]:text-text-primary",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    newsCategoryDotStyles[
                      item.ctg === "all"
                        ? "neutral"
                        : getNewsCategoryTone(item.ctg)
                    ],
                  )}
                />
                {item.ctg}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeCategory} className="mt-4">
          {showEditorial ? (
            <NewsEditorial items={list.pageItems} hrefBase="/home/berita" />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {list.pageItems.map((news) => (
                <FrameNews key={news.slug} {...news} hrefBase="/home/berita" />
              ))}
            </div>
          )}
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
