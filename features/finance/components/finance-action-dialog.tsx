"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  TCreateFinanceTransaction,
  TUpdateFinanceTransaction,
} from "@/schemas/finance";
import type { TFinanceTransaction } from "@/types/finance";

import { FinanceTransactionForm } from "./finance-transaction-form";

type TFinanceActionDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  transaction: TFinanceTransaction | null;
  suggestions: {
    categories: string[];
    penanggungJawab: string[];
    rekeningPenampung: string[];
  };
  onSubmit: (
    values: TCreateFinanceTransaction | TUpdateFinanceTransaction,
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  onOpenChange: (open: boolean) => void;
};

export function FinanceActionDialog({
  open,
  mode,
  transaction,
  suggestions,
  onSubmit,
  onOpenChange,
}: TFinanceActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit transaksi" : "Tambah transaksi"}
          </DialogTitle>
          <DialogDescription>
            Data akan ditulis ke tab BUKU BESAR KEUANGAN dan langsung tampil di dashboard.
          </DialogDescription>
        </DialogHeader>
        <FinanceTransactionForm
          mode={mode}
          transaction={transaction ?? undefined}
          suggestions={suggestions}
          onSubmit={onSubmit}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
