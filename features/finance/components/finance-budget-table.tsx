"use client";

import { useMemo } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TBudgetRealization } from "@/types/finance";
import { formatFinanceAmount } from "@/utils/finance-parser";

const percentUsed = (item: TBudgetRealization): number =>
  item.pagu > 0
    ? Math.min(100, Math.max(0, Math.round((item.realisasi / item.pagu) * 100)))
    : 0;

/** Blok B `DASHBOARD`: penyerapan anggaran per lembaga, seluruhnya dalam IDR. */
export function FinanceBudgetTable({
  items,
}: {
  items: TBudgetRealization[];
}) {
  const totals = useMemo(
    () =>
      items.reduce(
        (acc, item) => ({
          pagu: acc.pagu + item.pagu,
          realisasi: acc.realisasi + item.realisasi,
          sisa: acc.sisa + item.sisa,
        }),
        { pagu: 0, realisasi: 0, sisa: 0 },
      ),
    [items],
  );

  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="subheadline">Penyerapan Anggaran</CardTitle>
        <CardDescription className="footnote">
          Pagu awal, realisasi belanja, dan sisa anggaran per lembaga (IDR)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <caption className="sr-only">
              Laporan penyerapan anggaran per lembaga
            </caption>
            <thead>
              <tr className="border-y border-border bg-surface">
                <th scope="col" className="subheadline px-4 py-3">No</th>
                <th scope="col" className="subheadline px-4 py-3">Lembaga</th>
                <th scope="col" className="subheadline px-4 py-3 text-right">Pagu Awal</th>
                <th scope="col" className="subheadline px-4 py-3 text-right">Realisasi Belanja</th>
                <th scope="col" className="subheadline px-4 py-3 text-right">Sisa Anggaran</th>
                <th scope="col" className="subheadline px-4 py-3 text-right">Terpakai</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const used = percentUsed(item);
                return (
                  <tr key={`${item.no}-${item.lembaga}`} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-text-secondary">{item.no}</td>
                    <td className="px-4 py-3">
                      <p className="body text-text-primary">{item.lembaga}</p>
                      {item.unit ? (
                        <p className="footnote">{item.unit}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-primary">
                      {formatFinanceAmount(item.pagu, "IDR")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-primary">
                      {formatFinanceAmount(item.realisasi, "IDR")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-primary">
                      {formatFinanceAmount(item.sisa, "IDR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          aria-hidden
                          className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-hover"
                        >
                          <span
                            className="block h-full rounded-full bg-text-primary"
                            style={{ width: `${used}%` }}
                          />
                        </span>
                        <span className="footnote font-mono">{used}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-surface">
                <td className="subheadline px-4 py-3" colSpan={2}>
                  Total
                </td>
                <td className="px-4 py-3 text-right font-mono text-text-primary">
                  {formatFinanceAmount(totals.pagu, "IDR")}
                </td>
                <td className="px-4 py-3 text-right font-mono text-text-primary">
                  {formatFinanceAmount(totals.realisasi, "IDR")}
                </td>
                <td className="px-4 py-3 text-right font-mono text-text-primary">
                  {formatFinanceAmount(totals.sisa, "IDR")}
                </td>
                <td aria-hidden className="px-4 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
