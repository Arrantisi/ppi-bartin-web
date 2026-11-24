"use client";

import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconBuildingBank,
  IconCurrencyLira,
  IconExternalLink,
  IconPencil,
  IconPigMoney,
  IconTrash,
  IconWallet,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TFinanceTransaction } from "@/types/finance";
import {
  formatDateForSheet,
  formatFinanceAmount,
} from "@/utils/finance-parser";

const iconToneStyles = {
  success: "text-success",
  danger: "text-danger",
} as const;

type TFinanceColumnOptions = {
  canWrite: boolean;
  onEdit: (transaction: TFinanceTransaction) => void;
  onDelete: (transaction: TFinanceTransaction) => void;
};

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

export function getFinanceColumns({
  canWrite,
  onEdit,
  onDelete,
}: TFinanceColumnOptions): ColumnDef<TFinanceTransaction>[] {
  return [
    {
      accessorKey: "no",
      header: "No",
      cell: ({ row }) => (
        <span className="font-mono text-text-secondary">{row.original.no}</span>
      ),
    },
    {
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: ({ row }) => (
        <span className="font-mono whitespace-nowrap">
          {formatDateForSheet(row.original.tanggal)}
        </span>
      ),
    },
    {
      accessorKey: "keterangan",
      header: "Keterangan",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="body truncate text-text-primary">
            {row.original.keterangan}
          </p>
          <p className="footnote truncate text-text-secondary">
            {row.original.bulanPelaporan} · {row.original.kategori}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "arusKas",
      header: "Arus",
      cell: ({ row }) => (
        <Badge variant="outline" className="gap-1">
          {row.original.arusKas === "Debit" ? (
            <IconArrowDownLeft
              aria-hidden
              className={iconToneStyles.success}
            />
          ) : (
            <IconArrowUpRight
              aria-hidden
              className={iconToneStyles.danger}
            />
          )}
          <span className="text-text-primary">{row.original.arusKas}</span>
        </Badge>
      ),
    },
    {
      accessorKey: "mataUang",
      header: "MU",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-text-primary">
          {row.original.mataUang}
        </Badge>
      ),
    },
    {
      id: "nominal",
      header: "Nominal",
      cell: ({ row }) => (
        <span className="font-mono whitespace-nowrap text-text-primary">
          {formatFinanceAmount(
            row.original.mataUang === "TRY"
              ? row.original.nominalTry
              : row.original.nominalIdr,
            row.original.mataUang,
          )}
        </span>
      ),
    },
    {
      accessorKey: "rekeningPenampung",
      header: "Rekening",
      cell: ({ row }) => {
        const { code, label, Icon } = getRekeningPresentation(
          row.original.rekeningPenampung,
        );
        return (
          <div
            className="flex min-w-0 items-center gap-2"
            title={row.original.rekeningPenampung || undefined}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-hover">
              <Icon aria-hidden className="size-4 text-text-secondary" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-mono text-[0.625rem] leading-tight text-text-disabled">
                {code}
              </span>
              <span className="footnote truncate text-text-primary">
                {label}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      id: "dokumen",
      header: "Dokumen",
      cell: ({ row }) =>
        row.original.tautanDokumen ? (
          <a
            href={row.original.tautanDokumen}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Buka dokumen transaksi ${row.original.no}`}
            className="inline-flex text-accent hover:text-text-primary"
          >
            <IconExternalLink aria-hidden />
          </a>
        ) : (
          <span className="text-text-disabled" aria-label="Tidak ada dokumen">
            —
          </span>
        ),
    },
    ...(canWrite
      ? [
          {
            id: "actions",
            header: "Aksi",
            cell: ({ row }: { row: { original: TFinanceTransaction } }) => (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit transaksi ${row.original.no}`}
                  onClick={() => onEdit(row.original)}
                >
                  <IconPencil aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Hapus transaksi ${row.original.no}`}
                  onClick={() => onDelete(row.original)}
                >
                  <IconTrash aria-hidden className="text-danger" />
                </Button>
              </div>
            ),
          } satisfies ColumnDef<TFinanceTransaction>,
        ]
      : []),
  ];
}
