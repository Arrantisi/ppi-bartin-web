"use client";

import { userData } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columnsUserEvet } from "./columns";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { useState } from "react";
import SkeletonSearchUserEvent from "./skeleton-search-user";

export const SearchEventComponent = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["dataEventUser"],
    queryFn: () => userData(),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data ?? [],
    columns: columnsUserEvet,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="relative w-full mt-3 px-3">
      <div className="fixed grid grid-cols-10 gap-2 w-full left-0 top-14 px-3 z-50 bg-background">
        <Input
          className="w-full col-span-8 text-sm"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
        />
        <Button
          className="col-span-2"
          variant={"outline"}
          onClick={() => table.getColumn("name")?.setFilterValue("")}
        >
          Batal
        </Button>
      </div>
      <Table className="mt-24">
        {isLoading ? (
          <SkeletonSearchUserEvent />
        ) : (
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
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
                  colSpan={columnsUserEvet.length}
                  className="h-24 text-center"
                >
                  No data Result
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </div>
  );
};
