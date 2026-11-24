"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TFinanceTransaction } from "@/types/finance";

import { getFinanceColumns } from "./finance-columns";
import { FinanceTransactionCard } from "./finance-transaction-card";

type TFinanceDataTableProps = {
  data: TFinanceTransaction[];
  canWrite: boolean;
  onEdit: (transaction: TFinanceTransaction) => void;
  onDelete: (transaction: TFinanceTransaction) => void;
};

export function FinanceDataTable({
  data,
  canWrite,
  onEdit,
  onDelete,
}: TFinanceDataTableProps) {
  const [detailTransaction, setDetailTransaction] =
    useState<TFinanceTransaction | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Tanggal ISO bisa diurutkan leksikografis; baris terbaru jadi tie-breaker.
  const sortedData = useMemo(
    () =>
      [...data].sort(
        (a, b) => b.tanggal.localeCompare(a.tanggal) || b.rowNumber - a.rowNumber,
      ),
    [data],
  );

  const columns = useMemo(
    () => getFinanceColumns({ canWrite, onEdit, onDelete }),
    [canWrite, onEdit, onDelete],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API belum bisa dimemoisasi React Compiler.
  const table = useReactTable({
    data: sortedData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = table.getPageCount();
  const rows = table.getRowModel().rows;
  const first = sortedData.length
    ? pagination.pageIndex * pagination.pageSize + 1
    : 0;
  const last = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    sortedData.length,
  );

  useEffect(() => {
    if (pageCount > 0 && pagination.pageIndex >= pageCount) {
      setPagination((current) => ({ ...current, pageIndex: 0 }));
    }
  }, [pageCount, pagination.pageIndex]);

  const closeDetail = () => setDetailTransaction(null);

  const editFromDetail = (transaction: TFinanceTransaction) => {
    closeDetail();
    onEdit(transaction);
  };

  const deleteFromDetail = (transaction: TFinanceTransaction) => {
    closeDetail();
    onDelete(transaction);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="footnote text-text-secondary">
        Urutan: transaksi terbaru lebih dulu · klik baris untuk melihat detail
      </p>

      <div className="rounded-2xl border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={`${row.original.rowNumber}-${row.original.no}`}
                  tabIndex={0}
                  aria-label={`Lihat detail transaksi ${row.original.no}`}
                  className="cursor-pointer hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
                  onClick={() => setDetailTransaction(row.original)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setDetailTransaction(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-text-disabled"
                >
                  Tidak ada transaksi yang cocok dengan filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="footnote text-text-secondary">
          Menampilkan {first}–{last} dari {sortedData.length} transaksi
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Halaman sebelumnya"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <IconChevronLeft aria-hidden />
          </Button>
          <span className="font-mono text-sm text-text-secondary">
            {pagination.pageIndex + 1} / {Math.max(pageCount, 1)}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Halaman berikutnya"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <IconChevronRight aria-hidden />
          </Button>
        </div>
      </div>

      <Dialog
        open={detailTransaction !== null}
        onOpenChange={(open) => {
          if (!open) closeDetail();
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Detail transaksi</DialogTitle>
            <DialogDescription>
              Data dibaca dari tab BUKU BESAR KEUANGAN.
            </DialogDescription>
          </DialogHeader>
          {detailTransaction ? (
            <FinanceTransactionCard
              transaction={detailTransaction}
              canWrite={canWrite}
              onEdit={editFromDetail}
              onDelete={deleteFromDetail}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
