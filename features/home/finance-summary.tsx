import {
  IconAlertCircle,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconChartBar,
  IconCircleCheck,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TFinanceSnapshot } from "@/types/finance";
import { formatFinanceAmount } from "@/utils/finance-parser";
import { FinanceInfoHint } from "./finance-info-hint";

function SummaryBlock({
  title,
  icon,
  hint,
  children,
}: {
  title: string;
  icon: ReactNode;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border p-4">
      <h3 className="flex items-center gap-2 text-sm font-medium text-text-primary">
        {icon}
        {title}
        <FinanceInfoHint label={title}>{hint}</FinanceInfoHint>
      </h3>
      {children}
    </section>
  );
}

function CashRow({
  label,
  idr,
  tryAmount,
  Icon,
  tone = "neutral",
}: {
  label: string;
  idr: number;
  tryAmount: number;
  Icon: typeof IconWallet;
  tone?: "neutral" | "success" | "danger";
}) {
  const iconTone = {
    neutral: "text-text-disabled",
    success: "text-success",
    danger: "text-danger",
  }[tone];

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between gap-2">
        <span className="footnote flex items-center gap-1.5 text-text-secondary">
          <Icon aria-hidden className={cn("size-3", iconTone)} />
          {label}
        </span>
        <span className="font-mono text-sm text-text-primary">
          {formatFinanceAmount(idr, "IDR")}
        </span>
      </div>
      {tryAmount > 0 ? (
        <p className="footnote text-right font-mono text-text-secondary">
          {formatFinanceAmount(tryAmount, "TRY")}
        </p>
      ) : null}
    </div>
  );
}

function KasStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-surface p-2 text-center">
      {icon}
      <span className="font-mono text-base text-text-primary">{value}</span>
      <span className="footnote text-text-secondary">{label}</span>
    </div>
  );
}

/** `date-fns/format` melempar RangeError pada Invalid Date; jaga footer tetap render. */
function formatUpdatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return format(date, "d MMM yyyy, HH:mm", { locale: idLocale });
}

/** Ringkasan server-only untuk kartu Transparansi Keuangan di /home. */
export function FinanceSummary({ snapshot }: { snapshot: TFinanceSnapshot }) {
  const funds = snapshot.report?.funds ?? [];
  const budget = snapshot.report?.budget ?? [];
  const kas = snapshot.wajibKas?.summary;
  const totals = snapshot.totals;

  const pagu = budget.reduce((sum, row) => sum + row.pagu, 0);
  const realisasi = budget.reduce((sum, row) => sum + row.realisasi, 0);
  const sisa = budget.reduce((sum, row) => sum + row.sisa, 0);
  const realizationPercent =
    pagu > 0 ? Math.min(100, Math.round((realisasi / pagu) * 100)) : 0;

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6">
      {snapshot.kpiSource === "dummy" ? (
        <Badge variant="outline" className="w-fit text-warning">
          Data contoh
        </Badge>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-4">
        <SummaryBlock
          title="Saldo dana"
          icon={
            <IconWallet aria-hidden className="size-4 text-text-secondary" />
          }
          hint="Saldo lembaga, darurat, dan abadi sesuai tab DASHBOARD bendahara. Nilai IDR dan TRY ditampilkan apa adanya, tanpa konversi."
        >
          {funds.length ? (
            <ul className="flex flex-col gap-2">
              {funds.map((fund) => (
                <li
                  key={fund.key}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="body truncate text-text-secondary">
                    {fund.label}
                  </span>
                  <span className="font-mono text-sm text-text-primary">
                    {formatFinanceAmount(fund.idr, "IDR")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="footnote text-text-disabled">
              Data saldo belum tersedia.
            </p>
          )}
        </SummaryBlock>

        <SummaryBlock
          title="Arus kas"
          icon={
            <IconArrowDownLeft
              aria-hidden
              className="size-4 text-text-secondary"
            />
          }
          hint="Pemasukan dikurangi pengeluaran, dihitung dari buku besar. Sel DASHBOARD bersifat statis sehingga tidak dipakai untuk angka ini."
        >
          <div className="flex flex-col gap-2">
            <CashRow
              label="Pemasukan"
              idr={totals.pemasukanIdr}
              tryAmount={totals.pemasukanTry}
              Icon={IconArrowDownLeft}
              tone="success"
            />
            <CashRow
              label="Pengeluaran"
              idr={totals.pengeluaranIdr}
              tryAmount={totals.pengeluaranTry}
              Icon={IconArrowUpRight}
              tone="danger"
            />
            <CashRow
              label="Saldo"
              idr={totals.saldoIdr}
              tryAmount={totals.saldoTry}
              Icon={IconWallet}
            />
          </div>
        </SummaryBlock>

        <SummaryBlock
          title="Wajib kas"
          icon={
            <IconUsers aria-hidden className="size-4 text-text-secondary" />
          }
          hint="Rekap anggota yang lunas dan masih tunggakan dari tab WAJIB KAS. Nama anggota sengaja tidak ditampilkan di beranda."
        >
          {kas ? (
            <div className="grid grid-cols-3 gap-2">
              <KasStat
                label="Anggota"
                value={kas.total}
                icon={
                  <IconUsers
                    aria-hidden
                    className="size-3 text-text-secondary"
                  />
                }
              />
              <KasStat
                label="Lunas"
                value={kas.lunas}
                icon={
                  <IconCircleCheck
                    aria-hidden
                    className="size-3 text-success"
                  />
                }
              />
              <KasStat
                label="Tunggakan"
                value={kas.tunggakan}
                icon={
                  <IconAlertCircle aria-hidden className="size-3 text-danger" />
                }
              />
            </div>
          ) : (
            <p className="footnote text-text-disabled">
              Data WAJIB KAS belum tersedia.
            </p>
          )}
        </SummaryBlock>

        <SummaryBlock
          title="Penyerapan anggaran"
          icon={
            <IconChartBar aria-hidden className="size-4 text-text-secondary" />
          }
          hint="Total pagu, realisasi, dan sisa dari laporan penyerapan anggaran; persentase dihitung dari agregat ketiga angka tersebut."
        >
          {budget.length ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="footnote text-text-secondary">Pagu</span>
                <span className="font-mono text-sm text-text-primary">
                  {formatFinanceAmount(pagu, "IDR")}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="footnote text-text-secondary">Realisasi</span>
                <span className="font-mono text-sm text-text-primary">
                  {formatFinanceAmount(realisasi, "IDR")}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="footnote text-text-secondary">Sisa</span>
                <span className="font-mono text-sm text-text-primary">
                  {formatFinanceAmount(sisa, "IDR")}
                </span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-3xl bg-surface-hover"
                role="img"
                aria-label={`Realisasi anggaran ${realizationPercent}% dari pagu`}
              >
                <div
                  className="h-full rounded-3xl bg-primary"
                  style={{ width: `${realizationPercent}%` }}
                />
              </div>
              <p className="footnote text-text-secondary">
                {realizationPercent}% dari {budget.length} pos anggaran
              </p>
            </div>
          ) : (
            <p className="footnote text-text-disabled">
              Data anggaran belum tersedia.
            </p>
          )}
        </SummaryBlock>
      </div>

      <p className="footnote text-text-secondary">
        Sumber Google Sheets DKE · diperbarui{" "}
        <span className="font-mono">{formatUpdatedAt(snapshot.updatedAt)}</span>
      </p>
    </div>
  );
}
