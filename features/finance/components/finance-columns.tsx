"use client";

import { IconPencil, IconTrash } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import type { TFinanceTransaction } from "@/types/finance";
import {
  formatDateForSheet,
  formatFinanceAmount,
} from "@/utils/finance-parser";

import {
  FinanceArusBadge,
  FinanceDokumenBadge,
  FinanceMataUangBadge,
  FinanceRekeningToken,
} from "./finance-tokens";

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
        <FinanceArusBadge arusKas={row.original.arusKas} />
      ),
    },
    {
      accessorKey: "mataUang",
      header: "MU",
      cell: ({ row }) => (
        <FinanceMataUangBadge mataUang={row.original.mataUang} />
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
        <FinanceRekeningToken value={row.original.rekeningPenampung} />
      ),
    },
    {
      id: "dokumen",
      header: "Dokumen",
      cell: ({ row }) => (
        <FinanceDokumenBadge
          url={row.original.tautanDokumen}
          transactionNo={row.original.no}
        />
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
