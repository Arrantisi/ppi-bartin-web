"use client";

import {
  IconBuildingBank,
  IconLock,
  IconShieldCheck,
} from "@tabler/icons-react";

import type { TFinanceFund, TFinanceLegend } from "@/types/finance";

import { FinanceMetricCard } from "./finance-metric-card";

const fundIcons: Record<TFinanceFund["key"], React.ReactNode> = {
  lembaga: <IconBuildingBank aria-hidden className="size-5" />,
  darurat: <IconShieldCheck aria-hidden className="size-5" />,
  abadi: <IconLock aria-hidden className="size-5" />,
};

type TFinanceFundCardsProps = {
  funds: TFinanceFund[];
  legend: TFinanceLegend[];
};

/** Blok A `DASHBOARD`: saldo dana lembaga, darurat, dan abadi per mata uang. */
export function FinanceFundCards({ funds, legend }: TFinanceFundCardsProps) {
  if (funds.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {funds.map((fund) => (
          <FinanceMetricCard
            key={fund.key}
            label={fund.label}
            marker={fund.marker}
            hint="Saldo per mata uang"
            icon={fundIcons[fund.key]}
            values={[
              { currency: "IDR", amount: fund.idr },
              { currency: "TRY", amount: fund.try },
            ]}
          />
        ))}
      </div>

      {legend.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {legend.map((item) => (
            <li key={item.marker} className="flex gap-2 footnote">
              <span
                aria-hidden
                className="flex size-5 shrink-0 items-center justify-center rounded-chip bg-surface-hover font-mono"
              >
                {item.marker}
              </span>
              <span>{item.description}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
