"use client";

import { IconPencil, IconTrash } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import type { TFinanceTransaction } from "@/types/finance";
import {
  formatDateForSheet,
  formatFinanceAmount,
} from "@/utils/finance-parser";

import {
  FinanceArusBadge,
  FinanceDokumenBadge,
  FinanceMataUangBadge,
  FinanceRekeningToken,
} from "./finance-tokens";

type TFinanceTransactionCardProps = {
  transaction: TFinanceTransaction;
  canWrite: boolean;
  onEdit: (transaction: TFinanceTransaction) => void;
  onDelete: (transaction: TFinanceTransaction) => void;
};

/** Satu transaksi Buku Besar dalam tampilan kartu. */
export function FinanceTransactionCard({
  transaction,
  canWrite,
  onEdit,
  onDelete,
}: TFinanceTransactionCardProps) {
  const amount = formatFinanceAmount(
    transaction.mataUang === "TRY"
      ? transaction.nominalTry
      : transaction.nominalIdr,
    transaction.mataUang,
  );
  const counterparty = transaction.penerima
    ? `Kepada ${transaction.penerima}`
    : transaction.pengirim
      ? `Dari ${transaction.pengirim}`
      : "";

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-surface-hover">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.6875rem] text-text-disabled">
            #{transaction.no}
          </span>
          <time
            dateTime={transaction.tanggal}
            className="footnote font-mono text-text-secondary"
          >
            {formatDateForSheet(transaction.tanggal)}
          </time>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FinanceArusBadge arusKas={transaction.arusKas} />
          <FinanceMataUangBadge mataUang={transaction.mataUang} />
        </div>
      </header>

      <h3 className="subheadline mt-3 text-text-primary">
        {transaction.keterangan}
      </h3>
      <p className="footnote text-text-secondary">
        {transaction.bulanPelaporan} · {transaction.kategori}
      </p>
      <p className="footnote text-text-secondary">
        {transaction.metodeTransaksi} · {transaction.penanggungJawab}
      </p>
      {counterparty ? (
        <p className="footnote truncate text-text-disabled">{counterparty}</p>
      ) : null}

      <p className="mt-3 font-mono text-text-primary">{amount}</p>

      <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="footnote mb-1 text-text-disabled">Rekening</p>
          <FinanceRekeningToken value={transaction.rekeningPenampung} />
        </div>
        <div className="min-w-0">
          <p className="footnote mb-1 text-text-disabled">Dokumen</p>
          <FinanceDokumenBadge
            url={transaction.tautanDokumen}
            transactionNo={transaction.no}
          />
        </div>
      </div>

      {canWrite ? (
        <footer className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(transaction)}
          >
            <IconPencil aria-hidden />
            Edit
          </Button>
          <Button
            variant="destructive-outline"
            size="sm"
            onClick={() => onDelete(transaction)}
          >
            <IconTrash aria-hidden />
            Hapus
          </Button>
        </footer>
      ) : null}
    </article>
  );
}
