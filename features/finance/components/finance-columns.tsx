"use client";

import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconExternalLink,
  IconPencil,
  IconTrash,
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
      cell: ({ row }) => (
        <span className="footnote whitespace-nowrap text-text-secondary">
          {row.original.rekeningPenampung}
        </span>
      ),
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
