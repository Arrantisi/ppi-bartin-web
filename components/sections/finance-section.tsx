import { IconClock, IconFileText, IconShieldExclamation } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const FinanceSection = () => {
  return (
    <section id="finance" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <Badge className="mb-4 rounded-full bg-warning/10 text-warning hover:bg-warning/10">
              Upcoming
            </Badge>
            <h2 className="title-satu mb-6">
              Transparansi Keuangan
            </h2>
            <p className="body mb-8">
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
                  className="flex items-center gap-3 body text-text-primary"
                >
                  <IconClock className="text-warning w-5 h-5" /> {item}
                </li>
              ))}
            </ul>
            <Button className="mt-8 rounded-xl px-6 h-12 font-semibold">
              Menunggu Peluncuran
            </Button>
          </div>

          <div className="lg:w-1/2 w-full bg-background">
            <div className="bg-background p-6 rounded-3xl border border-dashed border-border shadow-xl">
              <div className="flex justify-between items-start mb-6 gap-4">
                <div>
                  <h3 className="title-tiga">
                    Status fitur keuangan
                  </h3>
                  <p className="footnote mt-1">
                    Belum aktif di versi sekarang.
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-warning/10 text-warning subheadline"
                >
                  SEGERA HADIR
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                    <IconShieldExclamation className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="body text-text-primary font-semibold">
                      Transparansi Keuangan
                    </p>
                    <p className="footnote">
                      Masih dalam pengerjaan dan belum tersedia untuk anggota.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                    <IconFileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="body text-text-primary font-semibold">
                      Laporan yang lebih mudah dibaca
                    </p>
                    <p className="footnote">
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
