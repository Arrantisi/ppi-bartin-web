"use client";

import { useState, type ReactNode } from "react";
import { IconDotsVertical, IconEye, IconTrash } from "@tabler/icons-react";

import { AdminConfirmDelete } from "@/features/dashboard/components/admin-confirm-delete";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TAdminRowActionsProps = {
  /** Label untuk pembaca layar, mis. "Aksi Budi". */
  label: string;
  onDetail: () => void;
  /** Item tambahan (submenu role/environment, blokir, export, dll.). */
  children?: ReactNode;
  deleteTitle: string;
  deleteDescription: string;
  onDelete: () => Promise<void> | void;
  deleteDisabled?: boolean;
};

/** Satu tombol "…" Menggantikan tumpukan tombol di kolom Aksi. */
export function AdminRowActions({
  label,
  onDetail,
  children,
  deleteTitle,
  deleteDescription,
  onDelete,
  deleteDisabled = false,
}: TAdminRowActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={label} title={label}>
            <IconDotsVertical aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onDetail}>
            <IconEye aria-hidden />
            Lihat detail
          </DropdownMenuItem>
          {children}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={deleteDisabled}
            onSelect={(event) => {
              event.preventDefault();
              setDeleteOpen(true);
            }}
          >
            <IconTrash aria-hidden />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AdminConfirmDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={deleteTitle}
        description={deleteDescription}
        onConfirm={onDelete}
      />
    </>
  );
}
