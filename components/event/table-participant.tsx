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
import {
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "../animate-ui/components/base/dialog";
import { TgetEventParticipants } from "@/server/data/events";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { EventTableParticipantSkeleton } from "../skeletons/event-table-participant-skeleton";
import { Input } from "../ui/input";
import { useEventParticipants } from "@/hooks/use-events";

type TparticipantRow = TgetEventParticipants[number];

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

export const DialogTableParticipant = ({ eventId }: { eventId: string }) => {
  const [columnFilters, setColumnFilter] = useState<ColumnFiltersState>([]);

  const queryClient = useQueryClient();

  const { data, isLoading } = useEventParticipants({ eventId });

  useEffect(() => {
    const channel = supabase.channel(`participants-${eventId}`).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "participants",
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ["participants", eventId] });
      },
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, eventId]);

  const table = useReactTable({
    data: data ?? [],
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
      <Input
        placeholder="filter Nama"
        value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("user")?.setFilterValue(e.target.value)
        }
        className="max-w-sm"
      />

      <div className="max-h-52 overflow-auto">
        <Table>
          {isLoading ? (
            <TableBody>
              {Array.from({ length: 7 }).map((_, idx) => (
                <EventTableParticipantSkeleton key={idx} />
              ))}
            </TableBody>
          ) : (
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
          )}
        </Table>
      </div>
    </DialogPopup>
  );
};
