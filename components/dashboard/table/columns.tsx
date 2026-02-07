"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserData } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "image",
    header: "Profile",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image") as string;
      const name = row.original.name;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-9">
            <AvatarImage src={imageUrl} alt={name || ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "nomorSiswa",
    header: "Nomor Siswa",
  },
  {
    id: "action",
    header: "action",
    cell: ({ row }) => {
      const dataUSer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(dataUSer.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
