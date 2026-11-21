"use client";

import { IconColumns3 } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TAdminColumnOption<TKey extends string> = {
  key: TKey;
  label: string;
};

type TAdminColumnToggleProps<TKey extends string> = {
  columns: ReadonlyArray<TAdminColumnOption<TKey>>;
  visible: Record<TKey, boolean>;
  onChange: (next: Record<TKey, boolean>) => void;
};

/** Menu show/hide kolom data. Kolom Aksi sengaja tidak ikut, jadi selalu tampil. */
export function AdminColumnToggle<TKey extends string>({
  columns,
  visible,
  onChange,
}: TAdminColumnToggleProps<TKey>) {
  const activeCount = columns.filter((column) => visible[column.key]).length;
  const hiddenCount = columns.length - activeCount;

  const handleToggle = (key: TKey, checked: boolean) => {
    if (!checked && visible[key] && activeCount <= 1) return;
    onChange({ ...visible, [key]: checked });
  };

  const reset = () => {
    onChange(
      Object.fromEntries(columns.map((column) => [column.key, true])) as Record<
        TKey,
        boolean
      >,
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <IconColumns3 aria-hidden />
          Customize Column
          {hiddenCount > 0 ? ` (${hiddenCount})` : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Kolom yang ditampilkan</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            checked={visible[column.key]}
            onCheckedChange={(checked) => handleToggle(column.key, checked === true)}
            onSelect={(event) => event.preventDefault()}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={reset}>Reset semua kolom</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
