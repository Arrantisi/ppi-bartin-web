import {
  IconAlertCircle,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconChartBar,
  IconCircleCheck,
  IconFileInvoice,
  IconFileOff,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TFinanceSnapshot, TFinanceTransaction } from "@/types/finance";
import { formatFinanceAmount } from "@/utils/finance-parser";

function SummaryBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border p-4">
      <h3 className="flex items-center gap-2 text-sm font-medium text-text-primary">
        {icon}
        {title}
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

function TransactionRow({ transaction }: { transaction: TFinanceTransaction }) {
  const amount =
    transaction.mataUang === "TRY"
      ? (transaction.nominalTry ?? 0)
      : (transaction.nominalIdr ?? 0);
  const date = new Date(`${transaction.tanggal}T00:00:00`);
  const hasDocument = Boolean(transaction.tautanDokumen);

  return (
    <li className="flex flex-col gap-2 rounded-2xl border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <time
          className="font-mono text-xs text-text-secondary"
          dateTime={transaction.tanggal}
        >
          {format(date, "d MMM yyyy", { locale: idLocale })}
        </time>
        <span className="flex items-center gap-1 text-xs text-text-secondary">
          {transaction.arusKas === "Debit" ? (
            <IconArrowDownLeft aria-hidden className="size-3 text-success" />
          ) : (
            <IconArrowUpRight aria-hidden className="size-3 text-danger" />
          )}
          {transaction.arusKas}
        </span>
      </div>
      <p
        className="body truncate text-text-primary"
        title={transaction.keterangan}
      >
        {transaction.keterangan}
      </p>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm text-text-primary">
          {formatFinanceAmount(amount, transaction.mataUang)}
        </span>
        <span className="flex items-center gap-1 text-xs text-text-secondary">
          {hasDocument ? (
            <IconFileInvoice aria-hidden className="size-3 text-text-secondary" />
          ) : (
            <IconFileOff aria-hidden className="size-3 text-text-disabled" />
          )}
          {hasDocument ? "Ada nota" : "Tanpa nota"}
        </span>
      </div>
    </li>
  );
}

/** Ringkasan server-only untuk kartu Transparansi Keuangan di /home. */
export function FinanceSummary({ snapshot }: { snapshot: TFinanceSnapshot }) {
  const funds = snapshot.report?.funds ?? [];
  const budget = snapshot.report?.budget ?? [];
  const kas = snapshot.wajibKas?.summary;
  const totals = snapshot.totals;
  const latestTransactions = [...snapshot.transactions]
    .sort(
      (a, b) =>
        b.tanggal.localeCompare(a.tanggal) || b.rowNumber - a.rowNumber,
    )
    .slice(0, 3);

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
          icon={<IconWallet aria-hidden className="size-4 text-text-secondary" />}
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
          icon={<IconUsers aria-hidden className="size-4 text-text-secondary" />}
        >
          {kas ? (
            <div className="grid grid-cols-3 gap-2">
              <KasStat
                label="Anggota"
                value={kas.total}
                icon={
                  <IconUsers aria-hidden className="size-3 text-text-secondary" />
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
                  <IconAlertCircle
                    aria-hidden
                    className="size-3 text-danger"
                  />
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

      <section className="flex flex-col gap-3 rounded-2xl border border-border p-4">
        <h3 className="text-sm font-medium text-text-primary">
          Transaksi terbaru
        </h3>
        {latestTransactions.length ? (
          <ul className="grid gap-3 md:grid-cols-3">
            {latestTransactions.map((transaction) => (
              <TransactionRow
                key={`${transaction.rowNumber}-${transaction.no}`}
                transaction={transaction}
              />
            ))}
          </ul>
        ) : (
          <p className="footnote text-text-disabled">Belum ada transaksi.</p>
        )}
      </section>

      <p className="footnote text-text-secondary">
        Sumber Google Sheets DKE · diperbarui{" "}
        {format(new Date(snapshot.updatedAt), "d MMM yyyy, HH:mm", {
          locale: idLocale,
        })}
      </p>
    </div>
  );
}
