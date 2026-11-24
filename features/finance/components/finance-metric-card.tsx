"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TMataUang } from "@/types/finance";
import { formatFinanceAmount } from "@/utils/finance-parser";

type TIconTone = "success" | "danger" | "neutral";

type TFinanceMetric = {
  currency: TMataUang;
  amount: number;
};

type TFinanceMetricCardProps = {
  label: string;
  marker?: string;
  hint?: string;
  icon: React.ReactNode;
  iconTone?: TIconTone;
  values: TFinanceMetric[];
};

const iconToneStyles: Record<TIconTone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-text-secondary",
};

/** Satu metrik dengan dua mata uang, mengikuti pasangan baris IDR/TRY di sheet. */
export function FinanceMetricCard({
  label,
  marker,
  hint,
  icon,
  iconTone = "neutral",
  values,
}: TFinanceMetricCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div className="space-y-1">
          <CardTitle className="subheadline flex items-baseline gap-1.5">
            <span>{label}</span>
            {marker ? (
              <span aria-hidden className="font-mono text-text-disabled">
                {marker}
              </span>
            ) : null}
          </CardTitle>
          {hint ? (
            <CardDescription className="footnote">{hint}</CardDescription>
          ) : null}
        </div>
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-hover",
            iconToneStyles[iconTone],
          )}
        >
          {icon}
        </span>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {values.map((value) => (
          <div
            key={value.currency}
            className="flex items-baseline justify-between gap-3 border-b border-border pb-1.5 last:border-0 last:pb-0"
          >
            <span className="footnote font-mono">{value.currency}</span>
            <span className="font-mono text-lg font-semibold text-text-primary">
              {formatFinanceAmount(value.amount, value.currency)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
