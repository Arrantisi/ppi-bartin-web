"use client";

import { ArrowRight, Newspaper, Calendar, Bell, Users } from "lucide-react";
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

      {/* ── SECTION 1: Hero / Painpoint ─────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="max-w-2xl space-y-6">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[--text-disabled] font-sans">
            PPI Bartın · Türkiye
          </p>
          <h1 className="text-[2rem] lg:text-[2.5rem] font-bold leading-[1.15] tracking-[-0.03em] text-text-primary">
            Info penting nggak seharusnya nyangkut di grup WhatsApp.
          </h1>
          <p className="text-[0.9375rem] leading-[1.7] text-[--text-secondary]">
            Pengumuman acara, info beasiswa, atau kegiatan organisasi sering
            tersebar di banyak grup dan story — gampang ke-skip, gampang
            ketinggalan. Portal PPI Bartın ngumpulin semuanya jadi satu
            tempat, biar kamu cukup buka satu aplikasi aja.
          </p>

          <div className="flex items-center gap-3 pt-2">
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
                Lihat Berita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-t border-[--border]" />
      </div>

      {/* ── SECTION 2: Kenapa portal ini ada ────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-3">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[--text-disabled] font-sans">
              Cerita singkat
            </p>
            <h2 className="text-[1.5rem] font-bold tracking-[-0.02em] text-text-primary leading-[1.2]">
              Dibuat oleh mahasiswa, untuk mahasiswa.
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-[0.9375rem] leading-[1.7] text-[--text-secondary]">
              Setiap tahun, mahasiswa baru datang ke Bartın dan harus mencari
              tahu sendiri: di mana info acara, siapa yang harus dihubungi,
              kegiatan apa yang sedang berjalan. Informasinya sebenarnya ada,
              tapi tersebar — dan sering baru ketahuan setelah acaranya lewat.
            </p>
            <p className="text-[0.9375rem] leading-[1.7] text-[--text-secondary]">
              Portal ini dibuat untuk menjawab itu. Satu tempat di mana
              seluruh anggota PPI Bartın bisa membaca berita organisasi,
              melihat agenda kegiatan, mendaftar acara, dan mendapat
              notifikasi langsung saat ada hal baru — tanpa harus scroll
              ulang chat grup.
            </p>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-t border-[--border]" />
      </div>

      {/* ── SECTION 3: Fitur utama ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="space-y-1 mb-10">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[--text-disabled] font-sans">
            Fitur
          </p>
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-text-primary">
            Semuanya di satu tempat
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-3 rounded-[10px] border border-[--border] bg-[--surface] p-5">
            <div className="w-9 h-9 rounded-lg bg-[--background] border border-[--border] flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-[--text-primary]" />
            </div>
            <h3 className="text-[0.9375rem] font-semibold text-text-primary">
              Berita & pengumuman
            </h3>
            <p className="text-[0.8125rem] leading-[1.6] text-[--text-secondary]">
              Update resmi dari organisasi, langsung dari sumbernya — bukan
              dari kabar berantai.
            </p>
          </div>

          <div className="space-y-3 rounded-[10px] border border-[--border] bg-[--surface] p-5">
            <div className="w-9 h-9 rounded-lg bg-[--background] border border-[--border] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[--text-primary]" />
            </div>
            <h3 className="text-[0.9375rem] font-semibold text-text-primary">
              Agenda & pendaftaran acara
            </h3>
            <p className="text-[0.8125rem] leading-[1.6] text-[--text-secondary]">
              Lihat kegiatan yang akan datang dan daftar langsung dari
              aplikasi, tanpa form terpisah.
            </p>
          </div>

          <div className="space-y-3 rounded-[10px] border border-[--border] bg-[--surface] p-5">
            <div className="w-9 h-9 rounded-lg bg-[--background] border border-[--border] flex items-center justify-center">
              <Bell className="w-4 h-4 text-[--text-primary]" />
            </div>
            <h3 className="text-[0.9375rem] font-semibold text-text-primary">
              Notifikasi langsung
            </h3>
            <p className="text-[0.8125rem] leading-[1.6] text-[--text-secondary]">
              Ada berita atau acara baru? Notifikasi muncul di HP kamu, real
              time.
            </p>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-t border-[--border]" />
      </div>

      {/* ── SECTION 4: Live preview (berita + acara, gabung) ─────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="space-y-1 mb-8">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[--text-disabled] font-sans">
            Live and Updated
          </p>
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-text-primary">
            Berita dan agenda terbaru
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Berita */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.05em] text-[--text-disabled]">
                Berita
              </h3>
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
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <NewsCaratogorySkeleton key={i} />
                ))}
              </div>
            ) : recentNews.length === 0 ? (
              <DataKosong href="/berita" catagory="Berita" />
            ) : (
              <div className="space-y-3">
                {recentNews.map((news) => (
                  <FrameNews
                    key={news.slug}
                    {...news}
                    hrefBase="/berita"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Acara */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.05em] text-[--text-disabled]">
                Agenda
              </h3>
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
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonCardAcara key={i} />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <DataKosong href="/acara" catagory="Acara" />
            ) : (
              <div className="space-y-3">
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
          </div>
        </div>

        <p className="text-[0.75rem] text-[--text-disabled] pt-6 text-center">
          Masuk untuk melihat semua berita, agenda, dan mendaftar kegiatan.
        </p>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-t border-[--border]" />
      </div>

      {/* ── SECTION 5: Footer CTA ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-[--surface] border border-[--border] flex items-center justify-center">
          <Users className="w-4 h-4 text-[--text-primary]" />
        </div>
        <h2 className="text-[1.5rem] font-bold tracking-[-0.02em] text-text-primary mb-3">
          Sudah jadi bagian dari PPI Bartın?
        </h2>
        <p className="text-[0.9375rem] text-[--text-secondary] leading-[1.6] mb-8 max-w-md mx-auto">
          Masuk dengan akun Google kamu untuk melengkapi profil, mendaftar
          kegiatan, dan dapat notifikasi setiap ada yang baru.
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