import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  BellRing,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  const highlights = [
    {
      icon: <Users className="size-4 text-primary" />,
      label: "Untuk anggota",
      text: "Profil, akses, dan informasi organisasi dalam satu tempat.",
    },
    {
      icon: <CalendarDays className="size-4 text-primary" />,
      label: "Agenda dan Kegiatan",
      text: "Acara dan berita tampil langsung dari data terbaru.",
    },
    {
      icon: <BellRing className="size-4 text-primary" />,
      label: "Notifikasi penting",
      text: "Pengumuman bisa diterima lebih cepat lewat browser.",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 pt-28 pb-16 lg:pt-36 lg:pb-24"
    >
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <div className="absolute left-1/2 top-[-8rem] z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left space-y-8">
            <Badge className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Portal resmi organisasi PPI Bartın
            </Badge>

            <div className="space-y-5">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
                Tentang Portal PPI Bartın
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Portal ini adalah tempat anggota PPI Bartın untuk membaca
                berita, melihat agenda, dan mengikuti informasi organisasi dalam
                satu ruang yang rapi dan mudah dipakai.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/berita">
                <Button
                  size="lg"
                  className="rounded-xl px-8 h-14 font-semibold gap-2 shadow-lg shadow-primary/20"
                >
                  Baca Berita <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/home">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl px-8 h-14 font-semibold border-border"
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
                  className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Ringkasan singkat
                </p>
                <p className="text-xs text-muted-foreground">
                  Satu pandangan cepat sebelum masuk ke detail.
                </p>
              </div>
              <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
                Aktif
              </Badge>
            </div>

            <div className="space-y-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-background/80 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm">
              <div className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="leading-relaxed text-muted-foreground">
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
