import { IconArrowRight, IconChartBar } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getFinanceSnapshot } from "@/server/data/finance";
import { FinanceSummary } from "./finance-summary";

export async function FinanceShortcut() {
  let snapshot: Awaited<ReturnType<typeof getFinanceSnapshot>> | null = null;
  try {
    snapshot = await getFinanceSnapshot();
  } catch {
    // Home tetap tampil bila Sheets gagal; detail di /home/finance memakai error state sendiri.
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
            <IconChartBar className="size-5" aria-hidden />
          </div>
          <div className="space-y-1">
            <h2 className="subheadline text-text-primary">
              Transparansi Keuangan
            </h2>
            <p className="footnote">
              Ringkasan pemasukan, pengeluaran, dan saldo PPI Bartın.
            </p>
          </div>
        </div>
        <Button
          render={<Link href="/home/finance" />}
          className="h-9 shrink-0 px-4"
        >
          Lihat Laporan Keuangan
          <IconArrowRight aria-hidden />
        </Button>
      </div>

      {snapshot ? (
        <FinanceSummary snapshot={snapshot} />
      ) : (
        <div className="mt-6 border-t border-border pt-6">
          <p className="footnote text-text-disabled">
            Ringkasan belum tersedia.
          </p>
        </div>
      )}
    </section>
  );
}
