import {
  IconArrowRight,
  IconCircleCheck,
  IconCalendarMonth,
  IconBellRinging,
  IconUsers,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  const highlights = [
    {
      icon: <IconUsers className="size-4 text-primary" />,
      label: "Untuk anggota",
      text: "Profil, akses, dan informasi organisasi dalam satu tempat.",
    },
    {
      icon: <IconCalendarMonth className="size-4 text-primary" />,
      label: "Agenda dan Kegiatan",
      text: "Acara dan berita tampil langsung dari data terbaru.",
    },
    {
      icon: <IconBellRinging className="size-4 text-primary" />,
      label: "Notifikasi penting",
      text: "Pengumuman bisa diterima lebih cepat lewat browser.",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background pt-28 pb-16 lg:pt-36 lg:pb-24"
    >
      {/* Improvise: keep the hero quiet and editorial instead of decorative. */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(15,125,219,0.04),transparent_48%)]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left space-y-8">
            <Badge className="rounded-full border border-border bg-accent-subtle px-3 py-1 subheadline text-accent">
              Portal resmi organisasi PPI Bartın
            </Badge>

            <div className="space-y-5">
              <h1 className="title-satu md:text-[2rem] lg:text-[2rem]">
                Tentang Portal PPI Bartın
              </h1>
              <p className="body md:text-[0.9375rem] leading-[1.7]">
                Portal ini adalah tempat anggota PPI Bartın untuk membaca
                berita, melihat agenda, dan mengikuti informasi organisasi dalam
                satu ruang yang rapi dan mudah dipakai.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/berita">
                <Button
                  size="lg"
                  className="rounded-xl px-8 h-14 font-semibold gap-2"
                >
                  Baca Berita <IconArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/home">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-xl px-8 h-14 font-semibold"
                >
                  Masuk ke Portal
                </Button>
              </Link>
            </div>

            <div className="inline-flex flex-wrap justify-center lg:justify-start gap-2">
              {[
                "Berita organisasi",
                "Acara dan kegiatan",
                "Akses anggota",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-surface px-3 py-1 subheadline text-text-secondary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="title-tiga">
                  Ringkasan singkat
                </p>
                <p className="footnote">
                  Satu pandangan cepat sebelum masuk ke detail.
                </p>
              </div>
              <Badge className="rounded-full bg-success-subtle text-success hover:bg-success-subtle">
                Aktif
              </Badge>
            </div>

            <div className="space-y-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="title-tiga">
                        {item.label}
                      </p>
                      <p className="footnote leading-[1.6]">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-border bg-surface-hover p-4 body">
              <div className="flex items-start gap-3">
                <IconCircleCheck className="mt-0.5 size-4 shrink-0 text-accent" />
                <p className="leading-[1.6]">
                  Semua informasi penting dikumpulkan agar anggota tidak perlu
                  mencari ke banyak tempat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
