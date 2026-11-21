"use client";

import { IconPlus, IconTable } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

type TFinanceEmptyStateProps = {
  canWrite: boolean;
  sheetUrl?: string;
  onAdd: () => void;
};

export function FinanceEmptyState({
  canWrite,
  sheetUrl,
  onAdd,
}: TFinanceEmptyStateProps) {
  if (canWrite) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border py-16 text-center">
        <IconTable aria-hidden className="size-8 text-text-disabled" />
        <p className="body text-text-disabled">Belum ada transaksi</p>
        <p className="footnote text-text-secondary">
          Tambahkan transaksi pertama untuk mulai mencatat arus kas.
        </p>
        <Button onClick={onAdd}>
          <IconPlus aria-hidden />
          Tambah transaksi pertama
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border py-16 text-center">
      <IconTable aria-hidden className="size-8 text-text-disabled" />
      <p className="body text-text-disabled">Belum ada transaksi</p>
      <p className="footnote text-text-secondary">
        Laporan belum tersedia di dashboard. Cek langsung di Google Sheets.
      </p>
      {sheetUrl && (
        <Button
          render={
            <a href={sheetUrl} target="_blank" rel="noopener noreferrer" />
          }
          variant="outline"
        >
          <IconPlus aria-hidden />
          Buka Google Sheets
        </Button>
      )}
    </div>
  );
}
