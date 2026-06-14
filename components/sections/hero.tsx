"use client";

import { ArrowRight, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useNews } from "@/hooks/use-news";
import { useEvents } from "@/hooks/use-events";
import { FrameNews } from "@/components/cards/card-news";
import CardEvent from "@/components/cards/card-event";
import { NewsCaratogorySkeleton } from "@/components/skeletons/news-catagory-skeleton";
import { SkeletonCardAcara } from "@/components/skeletons/card-event-skeleton";
import { DataKosong } from "@/components/data-kosong";

export const Hero = () => {
  const { data: newsData, isLoading: newsLoading } = useNews();
  const { data: eventsData, isLoading: eventsLoading } = useEvents();

  const recentNews = newsData?.slice(0, 3) ?? [];
  const upcomingEvents = eventsData?.slice(0, 2) ?? [];

  return (
    <div className="bg-background">

      {/* ── SECTION 1: Identity ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">

          {/* Left */}
          <div className="space-y-8 lg:pt-2">
            <div className="space-y-4">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[--text-disabled] font-sans">
                PPI Bartın · Türkiye
              </p>
              <h1 className="text-[2rem] font-bold leading-[1.15] tracking-[-0.03em] text-[--text-primary]">
                Satu tempat untuk mahasiswa Indonesia di Bartın.
              </h1>
              <p className="text-[0.9375rem] leading-[1.7] text-[--text-secondary]">
                Berita organisasi, agenda kegiatan, dan informasi penting —
                dikumpulkan agar kamu tidak perlu mencari ke banyak tempat.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/home">
                <Button
                  size="lg"
                  className="h-11 px-6 rounded-lg font-semibold gap-2 text-[0.9375rem]"
                >
                  Masuk ke Portal <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/berita">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-11 px-6 rounded-lg font-medium text-[0.9375rem] text-[--text-secondary] hover:text-[--text-primary]"
                >
                  Baca Berita
                </Button>
              </Link>
            </div>
          </div>

          {/* Right — live berita preview */}
          <div className="space-y-2">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[--text-disabled] font-mono mb-3">
              Terbaru
            </p>

            {newsLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <NewsCaratogorySkeleton key={i} />
              ))
            ) : recentNews.length === 0 ? (
              <div className="rounded-[10px] border border-[--border] bg-[--surface] p-4">
                <p className="text-[0.8125rem] text-[--text-disabled]">
                  Belum ada berita.
                </p>
              </div>
            ) : (
              recentNews.slice(0, 2).map((news) => (
                <FrameNews
                  key={news.slug}
                  {...news}
                  hrefBase="/berita"
                />
              ))
            )}

            <p className="text-[0.75rem] text-[--text-disabled] pt-1 px-1">
              Masuk untuk melihat semua berita dan kegiatan.
            </p>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-t border-[--border]" />
      </div>

      {/* ── SECTION 2: Berita Terbaru ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div className="space-y-1">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[--text-disabled] font-mono">
              Berita
            </p>
            <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-[--text-primary]">
              Terbaru dari organisasi
            </h2>
          </div>
          <Link href="/berita">
            <Button
              variant="ghost"
              size="sm"
              className="text-[0.8125rem] text-[--text-disabled] hover:text-[--text-primary] gap-1.5 px-2"
            >
              Lihat semua <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {newsLoading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <NewsCaratogorySkeleton key={i} />
            ))}
          </div>
        ) : recentNews.length === 0 ? (
          <DataKosong href="/berita" catagory="Berita" />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {recentNews.map((news) => (
              <FrameNews
                key={news.slug}
                {...news}
                hrefBase="/berita"
              />
            ))}
          </div>
        )}
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-t border-[--border]" />
      </div>

      {/* ── SECTION 3: Kegiatan ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div className="space-y-1">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[--text-disabled] font-mono">
              Kegiatan
            </p>
            <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-[--text-primary]">
              Agenda mendatang
            </h2>
          </div>
          <Link href="/acara">
            <Button
              variant="ghost"
              size="sm"
              className="text-[0.8125rem] text-[--text-disabled] hover:text-[--text-primary] gap-1.5 px-2"
            >
              Lihat semua <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {eventsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <SkeletonCardAcara key={i} />
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <DataKosong href="/acara" catagory="Kegiatan" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcomingEvents.map((event) => (
              <CardEvent
                key={event.id}
                {...event}
                hrefBase="/acara"
                showActions={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-t border-[--border]" />
      </div>

      {/* ── SECTION 4: Footer CTA ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[--text-disabled] font-mono mb-4">
          PPI Bartın · Türkiye
        </p>
        <h2 className="text-[1.5rem] font-bold tracking-[-0.02em] text-[--text-primary] mb-3">
          Sudah punya akun?
        </h2>
        <p className="text-[0.9375rem] text-[--text-secondary] leading-[1.6] mb-8 max-w-md mx-auto">
          Masuk untuk mendaftar kegiatan, melihat profil, dan mengikuti
          perkembangan organisasi.
        </p>
        <Link href="/home">
          <Button
            size="lg"
            className="h-11 px-8 rounded-lg font-semibold gap-2 text-[0.9375rem]"
          >
            Masuk ke Portal <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

    </div>
  );
};
