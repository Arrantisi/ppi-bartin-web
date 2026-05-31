import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-gradient">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Baru: Dukungan AI & Keamanan Better Auth
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6">
          Sistem Verifikasi & <br />
          <span className="text-primary">Transparansi PPI Bartın</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
          Wujudkan tata kelola organisasi yang modern, aman, dan transparan.
          Kelola database anggota dan pantau keuangan secara realtime.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="rounded-xl px-8 h-14 font-semibold gap-2 shadow-lg shadow-primary/20"
          >
            Buka Dashboard <ArrowRight className="w-5 h-5" />
          </Button>
          <Link href={"/home"}>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-8 h-14 font-semibold border-border"
            >
              Lihat Berita & Event
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
