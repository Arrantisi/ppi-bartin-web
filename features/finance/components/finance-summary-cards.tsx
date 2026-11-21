"use client";

import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconWallet,
} from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TFinanceTotals, TMataUang } from "@/types/finance";
import { formatFinanceAmount } from "@/utils/finance-parser";

type TIconTone = "success" | "danger" | "neutral";

type TSummaryCard = {
  label: string;
  value: number;
  currency: TMataUang;
  icon: React.ReactNode;
  hint: string;
  iconTone: TIconTone;
};

const iconToneStyles: Record<TIconTone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-text-secondary",
};

export function FinanceSummaryCards({ totals }: { totals: TFinanceTotals }) {
  const cards: TSummaryCard[] = [
    {
      label: "Pemasukan IDR",
      value: totals.pemasukanIdr,
      currency: "IDR",
      icon: <IconArrowDownLeft aria-hidden className="size-5" />,
      hint: "Arus kas Debit",
      iconTone: "success",
    },
    {
      label: "Pengeluaran IDR",
      value: totals.pengeluaranIdr,
      currency: "IDR",
      icon: <IconArrowUpRight aria-hidden className="size-5" />,
      hint: "Arus kas Kredit",
      iconTone: "danger",
    },
    {
      label: "Saldo IDR",
      value: totals.saldoIdr,
      currency: "IDR",
      icon: <IconWallet aria-hidden className="size-5" />,
      hint: "Pemasukan − pengeluaran",
      iconTone: "neutral",
    },
    {
      label: "Pemasukan TRY",
      value: totals.pemasukanTry,
      currency: "TRY",
      icon: <IconArrowDownLeft aria-hidden className="size-5" />,
      hint: "Arus kas Debit",
      iconTone: "success",
    },
    {
      label: "Pengeluaran TRY",
      value: totals.pengeluaranTry,
      currency: "TRY",
      icon: <IconArrowUpRight aria-hidden className="size-5" />,
      hint: "Arus kas Kredit",
      iconTone: "danger",
    },
    {
      label: "Saldo TRY",
      value: totals.saldoTry,
      currency: "TRY",
      icon: <IconWallet aria-hidden className="size-5" />,
      hint: "Pemasukan − pengeluaran",
      iconTone: "neutral",
    },
  ];

  return (
    <section
      aria-label="Ringkasan keuangan"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
            <div className="space-y-1">
              <CardTitle className="subheadline">{card.label}</CardTitle>
              <CardDescription className="footnote">
                {card.hint}
              </CardDescription>
            </div>
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-hover",
                iconToneStyles[card.iconTone],
              )}
            >
              {card.icon}
            </span>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xl font-semibold text-text-primary">
              {formatFinanceAmount(card.value, card.currency)}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
