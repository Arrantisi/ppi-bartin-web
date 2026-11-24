"use client";

import {
  IconChevronLeft,
  IconChevronRight,
  IconLayoutGrid,
  IconTable,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
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

type TFinanceView = "tabel" | "kartu";

export function FinanceDataTable({
  data,
  canWrite,
  onEdit,
  onDelete,
}: TFinanceDataTableProps) {
  const [view, setView] = useState<TFinanceView>("tabel");
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="footnote text-text-secondary">
          Urutan: transaksi terbaru lebih dulu
        </p>
        <div
          role="group"
          aria-label="Tampilan transaksi"
          className="flex items-center gap-1 rounded-xl border border-border p-1"
        >
          <Button
            size="sm"
            variant={view === "tabel" ? "secondary" : "ghost"}
            aria-pressed={view === "tabel"}
            onClick={() => setView("tabel")}
          >
            <IconTable aria-hidden />
            Tabel
          </Button>
          <Button
            size="sm"
            variant={view === "kartu" ? "secondary" : "ghost"}
            aria-pressed={view === "kartu"}
            onClick={() => setView("kartu")}
          >
            <IconLayoutGrid aria-hidden />
            Kartu
          </Button>
        </div>
      </div>

      {view === "tabel" ? (
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
                    className="hover:bg-surface-hover"
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
      ) : rows.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((row) => (
            <FinanceTransactionCard
              key={`${row.original.rowNumber}-${row.original.no}`}
              transaction={row.original}
              canWrite={canWrite}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border p-8 text-center text-text-disabled">
          Tidak ada transaksi yang cocok dengan filter.
        </div>
      )}

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
    </div>
  );
}
