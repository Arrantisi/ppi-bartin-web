import { CheckCircle2, ArrowDownLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const FinanceSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Teks Deskripsi */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-extrabold text-foreground mb-6">
              Transparansi Keuangan Tanpa Batas
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Setiap rupiah yang masuk dan keluar dicatat secara otomatis dan
              dapat dipantau oleh seluruh anggota secara realtime.
            </p>
            <ul className="space-y-4">
              {[
                "Laporan Kas Bulanan Otomatis",
                "Bukti Transaksi Digital Terverifikasi",
                "Visualisasi Arus Kas Interaktif",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-foreground font-medium"
                >
                  <CheckCircle2 className="text-green-500 w-5 h-5" /> {item}
                </li>
              ))}
            </ul>
            <Button className="mt-8 rounded-xl px-6 h-12 font-semibold shadow-lg shadow-primary/20">
              Buka Laporan Keuangan
            </Button>
          </div>

          {/* Visual Live Arus Kas */}
          <div className="lg:w-1/2 w-full bg-background">
            <div className="bg-background p-6 rounded-3xl border border-border shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-foreground">Live Arus Kas</h3>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold"
                >
                  UPDATE: 12 MENIT LALU
                </Badge>
              </div>

              <div className="space-y-4">
                {/* Item Masuk */}
                <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                      <ArrowDownLeft className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        Iuran Anggota Okt
                      </p>
                      <p className="text-xs text-muted-foreground">
                        15 Okt 2023
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-green-600 text-lg">+₺800</p>
                </div>

                {/* Item Keluar */}
                <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        Sewa Aula Futsal
                      </p>
                      <p className="text-xs text-muted-foreground">
                        12 Okt 2023
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-red-600 text-lg">-₺250</p>
                </div>
              </div>

              {/* Total Card */}
              <div className="mt-6 p-6 bg-foreground text-background rounded-2xl flex justify-between items-center shadow-inner">
                <div>
                  <p className="text-xs opacity-70 font-bold uppercase mb-1">
                    Total Kas Saat Ini
                  </p>
                  <p className="text-2xl font-extrabold tracking-tight">
                    ₺4.150,00
                  </p>
                </div>
                <div className="text-right text-[10px] opacity-60 font-medium leading-tight">
                  <p>Dana Aman</p>
                  <p>Audited 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
