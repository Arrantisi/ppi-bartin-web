"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useNews } from "@/hooks/use-news";
import { FrameNews } from "@/components/cards/card-news";
import { NewsCaratogorySkeleton } from "@/components/skeletons/news-catagory-skeleton";
import { DataKosong } from "@/components/data-kosong";

export const NewsSection = () => {
  const { data, isLoading } = useNews();

  return (
    <section id="berita" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <Badge className="mb-4 rounded-full bg-primary/10 text-primary hover:bg-primary/10">
              Live dari database
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">
              Berita terbaru
            </h2>
            <p className="text-muted-foreground text-lg">
              Artikel dan berita terbaru tentang PPI Bartin. Live dan ter-update. Ditulis oleh anggota untuk anggota.
            </p>
          </div>
          <Link href="/berita">
            <Button
              variant="outline"
              className="rounded-full border-border group"
            >
              Lihat semua berita{" "}
              <IconArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <NewsCaratogorySkeleton key={idx} />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <DataKosong href="/berita" catagory="Berita" />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {data.slice(0, 4).map((news) => (
              <FrameNews key={news.slug} {...news} hrefBase="/berita" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
