/* eslint-disable react-hooks/incompatible-library */
"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useState } from "react";

import { Tparticipants } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "@/components/animate-ui/components/base/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

type TparticipantRow = Tparticipants[number];

const columns: ColumnDef<TparticipantRow>[] = [
  {
    accessorKey: "user",
    header: "Profile",
    filterFn: (row, columnId, filterValue: string) => {
      const user = row.getValue(columnId) as TparticipantRow["user"];
      const search = filterValue.toLowerCase();

      return (
        user.name?.toLowerCase().includes(search) ||
        user.username?.toLowerCase().includes(search) ||
        false
      );
    },
    cell: ({ row }) => {
      const { image, name, username } = row.original.user;

      return (
        <div className="flex justify-center items-center gap-3">
          <Avatar>
            <AvatarImage src={image || ""} alt="" />
            <AvatarFallback>BA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start space-y-0.5">
            <h1 className="font-semibold text-sm tracking-[0.25px]">
              {username}
            </h1>
            <p className="font-light text-xs text-muted-foreground">{name}</p>
          </div>
        </div>
      );
    },
  },
];

type DialogTableParticipantProps = {
  participants: Tparticipants;
};

export const DialogTableParticipant = ({
  participants,
}: DialogTableParticipantProps) => {
  const [columnFilters, setColumnFilter] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: participants ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <DialogPopup>
      <DialogHeader className="items-start">
        <DialogTitle>Table Participant</DialogTitle>
        <DialogDescription>Orang yang mengikuti event ini</DialogDescription>
      </DialogHeader>
      <div className="flex justify-center items-center gap-2">
        <Input
          placeholder="filter Nama"
          value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("user")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Button variant={"outline"} className="text-sm">
          Export csv
        </Button>
      </div>

      <div className="max-h-52 overflow-auto">
        <Table>
          <TableBody className="flex flex-col justify-start">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  className="h-24 text-center"
                >
                  No data Result
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DialogPopup>
  );
};
