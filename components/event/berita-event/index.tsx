"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconShare, IconBookmark } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const BeritaEventComoponent = () => {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto bg-background min-h-screen pb-10">
      {/* Sticky Top Navigation */}
      <nav className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background shadow-2xl"
          onClick={() => router.back()}
        >
          <IconArrowLeft size={24} />
        </Button>
        <span className="font-bold text-lg bg-background shadow-2xl rounded-4xl p-2 px-3">
          Berita
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full  bg-background shadow-2xl"
          >
            <IconShare size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full  bg-background shadow-2xl"
          >
            <IconBookmark size={24} />
          </Button>
        </div>
      </nav>

      <div className="px-5">
        {/* Author & Meta */}
        <div className="flex items-center gap-3 mt-6">
          <Avatar className="size-10 border">
            <AvatarImage src="/user-profile-02.png" />
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Dapta Ganteng</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>15 Feb 2026</span>
              <div className="size-1 rounded-full bg-muted-foreground" />
              <Badge
                variant="secondary"
                className="text-[10px] h-4 leading-none"
              >
                Beasiswa
              </Badge>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mt-4 leading-tight">
          Beasiswa Türkiye Bursları 2025 Dibuka! Simak Syarat dan Cara Daftarnya
        </h1>

        {/* Hero Image */}
        <div className="relative aspect-video w-full mt-6 overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/prestasi-news.jpeg"
            alt="Beasiswa Turki"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Bagian Article - Khusus Teks Beasiswa */}
        <article className="mt-8 px-5 max-w-2xl mx-auto">
          <div className="text-foreground/90 leading-relaxed whitespace-pre-line text-base md:text-lg tracking-wide">
            {`ISTANBUL, TURKI - Kabar gembira bagi kamu yang ingin melanjutkan studi ke Turki! Pemerintah Turki kembali membuka pendaftaran beasiswa Türkiye Burslari untuk tahun akademik 2025-2026. Beasiswa bergengsi ini menawarkan kesempatan emas untuk kuliah gratis di universitas-universitas terbaik Turki dengan fasilitas yang sangat lengkap.

APA ITU TÜRKIYE BURSLARI?

Türkiye Burslari adalah program beasiswa penuh yang diberikan oleh pemerintah Turki melalui Presidency for Turks Abroad and Related Communities (YTB). Beasiswa ini terbuka untuk calon mahasiswa internasional dari seluruh dunia, termasuk Indonesia, untuk program Sarjana (S1), Magister (S2), dan Doktoral (S3).

FASILITAS BEASISWA

Beasiswa Türkiye Burslari menawarkan fasilitas yang sangat komplet, antara lain:

✅ Biaya kuliah GRATIS penuh
✅ Tunjangan bulanan (sekitar 5.000 - 7.000 TL tergantung jenjang)
✅ Akomodasi/tempat tinggal gratis di asrama
✅ Asuransi kesehatan
✅ Tiket pesawat pulang-pergi (1x setahun)
✅ Kursus bahasa Turki gratis selama 1 tahun
✅ Tidak ada ikatan dinas setelah lulus

PERSYARATAN UMUM

Untuk mendaftar Türkiye Burslari 2025, kamu harus memenuhi persyaratan berikut:

UNTUK S1 (SARJANA):
- Belum berusia 21 tahun pada 1 Januari tahun pendaftaran
- Lulusan SMA/sederajat dengan nilai minimal 70%
- Belum pernah terdaftar di universitas Turki untuk program yang sama`.trim()}
          </div>

          <div className="mt-10 pt-6 border-t border-muted text-xs text-muted-foreground text-center">
            <p>
              Informasi lebih lanjut dapat diakses melalui website resmi YTB.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BeritaEventComoponent;
