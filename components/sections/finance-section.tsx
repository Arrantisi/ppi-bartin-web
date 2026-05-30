import { Clock3, FileText, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const FinanceSection = () => {
  return (
    <section id="finance" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <Badge className="mb-4 rounded-full bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400">
              Upcoming
            </Badge>
            <h2 className="text-3xl font-extrabold text-foreground mb-6">
              Transparansi Keuangan
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Fitur ini masih disiapkan. Saat peluncuran, anggota akan melihat
              ringkasan pemasukan, pengeluaran, dan laporan yang lebih mudah
              dipahami.
            </p>
            <ul className="space-y-4">
              {[
                "Ringkasan keuangan yang lebih mudah dibaca",
                "Catatan pemasukan dan pengeluaran yang rapi",
                "Akses laporan untuk kebutuhan organisasi",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-foreground font-medium"
                >
                  <Clock3 className="text-amber-600 w-5 h-5" /> {item}
                </li>
              ))}
            </ul>
            <Button className="mt-8 rounded-xl px-6 h-12 font-semibold shadow-lg shadow-primary/20">
              Menunggu Peluncuran
            </Button>
          </div>

          <div className="lg:w-1/2 w-full bg-background">
            <div className="bg-background p-6 rounded-3xl border border-dashed border-border shadow-xl">
              <div className="flex justify-between items-start mb-6 gap-4">
                <div>
                  <h3 className="font-bold text-foreground">
                    Status fitur keuangan
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Belum aktif di versi sekarang.
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold"
                >
                  SEGERA HADIR
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      Transparansi Keuangan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Masih dalam pengerjaan dan belum tersedia untuk anggota.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      Laporan yang lebih mudah dibaca
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Akan dibuat lebih ringkas untuk kebutuhan harian.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
