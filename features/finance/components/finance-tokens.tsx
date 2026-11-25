"use client";

import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconBuildingBank,
  IconCurrencyLira,
  IconExternalLink,
  IconFileInvoice,
  IconFileOff,
  IconPigMoney,
  IconWallet,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import type { TArusKas, TMataUang } from "@/types/finance";

const REKENING_PRESETS = [
  {
    match: /rupiah|idr/i,
    code: "IDR",
    label: "Kas Rupiah",
    Icon: IconBuildingBank,
  },
  {
    match: /lira|try/i,
    code: "TRY",
    label: "Kas Lira",
    Icon: IconCurrencyLira,
  },
  {
    match: /fundriser|fundraiser|dana/i,
    code: "DANA",
    label: "Dana Fundriser",
    Icon: IconPigMoney,
  },
] as const;

/** Ikon + kode pendek untuk kolom M. Nilai asli tetap tampil di `title`. */
function getRekeningPresentation(value: string) {
  const preset = REKENING_PRESETS.find((item) => item.match.test(value));
  if (preset) return preset;
  return {
    code: "REK.",
    label: value || "Tanpa rekening",
    Icon: IconWallet,
  };
}

export function FinanceArusBadge({ arusKas }: { arusKas: TArusKas }) {
  return (
    <Badge variant="outline" className="gap-1">
      {arusKas === "Debit" ? (
        <IconArrowDownLeft aria-hidden className="text-success" />
      ) : (
        <IconArrowUpRight aria-hidden className="text-danger" />
      )}
      <span className="text-text-primary">{arusKas}</span>
    </Badge>
  );
}

export function FinanceMataUangBadge({ mataUang }: { mataUang: TMataUang }) {
  return (
    <Badge variant="outline" className="text-text-primary">
      {mataUang}
    </Badge>
  );
}

export function FinanceRekeningToken({ value }: { value: string }) {
  const { code, label, Icon } = getRekeningPresentation(value);
  return (
    <div
      className="flex min-w-0 items-center gap-2"
      title={value || undefined}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-hover">
        <Icon aria-hidden className="size-4 text-text-secondary" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-mono text-[0.625rem] leading-tight text-text-disabled">
          {code}
        </span>
        <span className="footnote truncate text-text-primary">{label}</span>
      </span>
    </div>
  );
}

type TFinanceDokumenBadgeProps = {
  url: string;
  transactionNo: number;
};

export function FinanceDokumenBadge({
  url,
  transactionNo,
}: TFinanceDokumenBadgeProps) {
  if (!url) {
    return (
      <Badge variant="outline" className="gap-1 text-text-disabled">
        <IconFileOff aria-hidden />
        <span>Tanpa nota</span>
      </Badge>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buka dokumen transaksi ${transactionNo}`}
      className="rounded-3xl focus-visible:outline-2 focus-visible:outline-ring"
      onClick={(event) => event.stopPropagation()}
    >
      <Badge
        variant="outline"
        className="gap-1 text-text-primary hover:bg-surface-hover"
      >
        <IconFileInvoice aria-hidden className="text-text-secondary" />
        <span>Ada nota</span>
        <IconExternalLink aria-hidden />
      </Badge>
    </a>
  );
}
