import { IconArrowDownLeft, IconArrowUpRight } from "@tabler/icons-react";

export const DashboardPreview = () => {
  return (
    <div className="relative max-w-5xl mx-auto mt-12 px-4 group">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-brand-red/20 rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000" />

      <div className="relative bg-card text-card-foreground rounded-2xl shadow-2xl overflow-hidden border border-border animate-float">
        {/* Browser Header */}
        <div className="h-10 border-b border-border bg-muted/50 flex items-center px-4 gap-1.5">
          <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
          <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
          <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
          <div className="ml-4 subheadline">
            dashboard.ppibartin.org
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="title-tiga">Ringkasan Anggota</h3>
              <span className="footnote text-primary font-semibold">
                LIVE UPDATES
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {["Total Aktif", "Alumni", "Verifikasi"].map((label, i) => (
                <div
                  key={label}
                  className="p-4 rounded-xl bg-muted/30 border border-border"
                >
                  <p className="subheadline mb-1">
                    {label}
                  </p>
                  <p
                    className={`title-satu ${i === 2 ? "text-danger" : "text-text-primary"}`}
                  >
                    {i === 0 ? "142" : i === 1 ? "89" : "98%"}
                  </p>
                </div>
              ))}
            </div>

            {/* Mock Chart */}
            <div className="h-40 w-full bg-muted/20 rounded-xl border border-border flex items-end justify-between p-4 gap-2">
              {[0.5, 0.75, 0.6, 1, 0.5].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-primary/40 rounded-t transition-all hover:bg-primary"
                  style={{ height: `${h * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="title-tiga">Aliran Dana</h3>
            <div className="space-y-3">
              <FinanceItem
                icon={<IconArrowDownLeft className="text-success" />}
                label="Kas Masuk"
                date="12 Okt"
                amount="+₺450"
                color="text-success"
              />
              <FinanceItem
                icon={<IconArrowUpRight className="text-danger" />}
                label="Logistik"
                date="10 Okt"
                amount="-₺120"
                color="text-danger"
              />
            </div>
            <div className="mt-4 p-4 rounded-xl bg-primary text-primary-foreground">
              <p className="subheadline opacity-80 mb-1">
                Saldo Tersedia
              </p>
              <p className="title-tiga text-primary-foreground">₺3.240,50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FinanceItem = ({ icon, label, date, amount, color }: any) => (
  <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="footnote text-text-primary font-semibold">{label}</p>
        <p className="subheadline text-text-disabled">{date}</p>
      </div>
    </div>
    <p className={`footnote font-semibold ${color}`}>{amount}</p>
  </div>
);
