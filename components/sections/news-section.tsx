import Image from "next/image";
import { Calendar, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const newsData = [
  {
    title: "Update Verifikasi Anggota Musim Dingin",
    category: "Pengumuman",
    date: "20 Feb 2026",
    author: "Sekretaris",
    image: "/apartmen-news.jpeg", // Pastikan file di public sudah lowercase
  },
  {
    title: "Peringatan Hari Besar Nasional di Bartın",
    category: "Kegiatan",
    date: "17 Feb 2026",
    author: "Humas",
    image: "/nkri-news.jpeg",
  },
];

export const NewsSection = () => {
  return (
    <section className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">
              Berita & Agenda Terkini
            </h2>
            <p className="text-muted-foreground text-lg">
              Pantau terus kegiatan terbaru dan pengumuman resmi dari pengurus
              PPI Bartın.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full border-border group"
          >
            Lihat Semua{" "}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {newsData.map((news, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border mb-6">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none hover:bg-background/90 px-3 py-1">
                    {news.category}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {news.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {news.author}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {news.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2">
                  Informasi lebih lanjut mengenai agenda ini dapat diakses
                  melalui portal anggota resmi PPI Bartın...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
