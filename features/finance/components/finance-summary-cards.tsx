"use client";

import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconWallet,
} from "@tabler/icons-react";

import type { TFinanceTotals } from "@/types/finance";

import { FinanceMetricCard } from "./finance-metric-card";

/** Lanjutan blok A `DASHBOARD`: pendapatan, pengeluaran, dan total saldo. */
export function FinanceSummaryCards({ totals }: { totals: TFinanceTotals }) {
  const cards = [
    {
      label: "Pendapatan",
      marker: "*",
      hint: "Arus kas Debit",
      icon: <IconArrowDownLeft aria-hidden className="size-5" />,
      iconTone: "success" as const,
      values: [
        { currency: "IDR" as const, amount: totals.pemasukanIdr },
        { currency: "TRY" as const, amount: totals.pemasukanTry },
      ],
    },
    {
      label: "Pengeluaran",
      marker: "**",
      hint: "Arus kas Kredit",
      icon: <IconArrowUpRight aria-hidden className="size-5" />,
      iconTone: "danger" as const,
      values: [
        { currency: "IDR" as const, amount: totals.pengeluaranIdr },
        { currency: "TRY" as const, amount: totals.pengeluaranTry },
      ],
    },
    {
      label: "Total Saldo",
      hint: "Pemasukan − pengeluaran",
      icon: <IconWallet aria-hidden className="size-5" />,
      iconTone: "neutral" as const,
      values: [
        { currency: "IDR" as const, amount: totals.saldoIdr },
        { currency: "TRY" as const, amount: totals.saldoTry },
      ],
    },
  ];

  return (
    <section
      aria-label="Ringkasan arus kas"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {cards.map((card) => (
        <FinanceMetricCard key={card.label} {...card} />
      ))}
    </section>
  );
}
