"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import type { TFinanceTransaction } from "@/types/finance";
import { formatDateForSheet } from "@/utils/finance-parser";

type TFinanceDeleteDialogProps = {
  open: boolean;
  transaction: TFinanceTransaction | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function FinanceDeleteDialog({
  open,
  transaction,
  isPending,
  onOpenChange,
  onConfirm,
}: TFinanceDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus transaksi?</DialogTitle>
          <DialogDescription>
            {transaction ? (
              <>
                Transaksi{" "}
                <span className="text-text-primary">
                  &ldquo;{transaction.keterangan}&rdquo;
                </span>{" "}
                ({formatDateForSheet(transaction.tanggal)}) akan dikosongkan.
              </>
            ) : (
              "Transaksi akan dikosongkan."
            )}
          </DialogDescription>
        </DialogHeader>
        <p className="footnote text-text-secondary">
          Nilai baris di Google Sheets dikosongkan. Nomor baris tidak berubah, jadi rumus di
          tab DASHBOARD tetap stabil.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button variant="destructive" disabled={isPending} onClick={onConfirm}>
            {isPending && <Spinner aria-hidden />}
            Hapus nilai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
