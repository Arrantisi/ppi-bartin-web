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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TFinanceTransaction } from "@/types/finance";

import { getFinanceColumns } from "./finance-columns";

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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => getFinanceColumns({ canWrite, onEdit, onDelete }),
    [canWrite, onEdit, onDelete],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API belum bisa dimemoisasi React Compiler.
  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = table.getPageCount();

  useEffect(() => {
    if (pageCount > 0 && pagination.pageIndex >= pageCount) {
      setPagination((current) => ({ ...current, pageIndex: 0 }));
    }
  }, [pageCount, pagination.pageIndex]);

  return (
    <div className="flex flex-col gap-4">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
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

      <div className="flex items-center justify-between gap-3">
        <p className="footnote text-text-secondary">
          Menampilkan {data.length ? pagination.pageIndex * pagination.pageSize + 1 : 0}–
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length)} dari{" "}
          {data.length} transaksi
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
