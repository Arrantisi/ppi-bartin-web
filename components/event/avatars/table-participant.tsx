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
import { authClient } from "@/lib/auth-client";

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
  eventId: string;
  judul: string;
  userCreatorId: string;
};

export const DialogTableParticipant = ({
  userCreatorId,
  judul,
  eventId,
  participants,
}: DialogTableParticipantProps) => {
  const [columnFilters, setColumnFilter] = useState<ColumnFiltersState>([]);

  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

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

  const handleDownload = () => {
    window.location.href = `/api/export/participants?eventId=${eventId}`;
  };

  return (
    <DialogPopup>
      <DialogHeader className="items-start">
        <DialogTitle>{judul}</DialogTitle>
        <DialogDescription>Orang yang mengikuti kegiatan</DialogDescription>
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

        {userCreatorId === userId && (
          <Button
            variant={"outline"}
            onClick={handleDownload}
            className="text-sm"
          >
            Export (.csv)
          </Button>
        )}
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
