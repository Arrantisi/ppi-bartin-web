"use server";

import {
  createFinanceTransactionSchema,
  deleteFinanceTransactionSchema,
  updateFinanceTransactionSchema,
  type TCreateFinanceTransaction,
  type TDeleteFinanceTransaction,
  type TUpdateFinanceTransaction,
} from "@/schemas/finance";
import { env } from "@/lib/env";
import {
  appendFinanceRow,
  clearFinanceRow,
  updateFinanceRow,
} from "@/lib/google-sheets";
import { getCurrentUserRole } from "@/server/actions/account";
import { getFinanceSnapshot } from "@/server/data/finance";
import type { TFinanceTransaction } from "@/types/finance";
import type { TServerPrompt } from "@/types/index";
import {
  buildFinanceSheetRow,
  monthNameFromIsoDate,
} from "@/utils/finance-parser";

const canWriteFinance = async (): Promise<boolean> => {
  const role = await getCurrentUserRole();
  return role === "BENDAHARA" || role === "ADMIN";
};

const dummyModeError = () =>
  env.FINANCE_USE_DUMMY_DATA === "true"
    ? ({ success: false, error: "Mode data contoh: perubahan tidak disimpan" } as const)
    : null;

const toTransaction = (
  input: TCreateFinanceTransaction,
  no: number,
  rowNumber: number,
  bulanPelaporan?: string,
): TFinanceTransaction => ({
  rowNumber,
  no,
  tanggal: input.tanggal,
  bulanPelaporan: bulanPelaporan ?? monthNameFromIsoDate(input.tanggal),
  keterangan: input.keterangan,
  kategori: input.kategori,
  arusKas: input.arusKas,
  mataUang: input.mataUang,
  nominalTry: input.mataUang === "TRY" ? (input.nominalTry ?? 0) : 0,
  nominalIdr: input.mataUang === "IDR" ? (input.nominalIdr ?? 0) : 0,
  metodeTransaksi: input.metodeTransaksi,
  penanggungJawab: input.penanggungJawab,
  rekeningPenampung: input.rekeningPenampung,
  penerima: input.penerima ?? "",
  pengirim: input.pengirim ?? "",
  tautanDokumen: input.tautanDokumen ?? "",
});

const fieldErrorsFrom = (error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): Record<string, string[]> => {
  const flattened = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flattened).map(([key, value]) => [key, value ?? []]),
  );
};

export async function createFinanceTransaction(
  input: TCreateFinanceTransaction,
): Promise<TServerPrompt<TFinanceTransaction>> {
  try {
    const dummyError = dummyModeError();
    if (dummyError) return dummyError;

    if (!(await canWriteFinance())) {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = createFinanceTransactionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: fieldErrorsFrom(parsed.error),
      };
    }

    const snapshot = await getFinanceSnapshot();
    const no =
      Math.max(0, ...snapshot.transactions.map((transaction) => transaction.no)) +
      1;
    const transaction = toTransaction(parsed.data, no, 0);
    const rowNumber = await appendFinanceRow(buildFinanceSheetRow(transaction));

    return {
      success: true,
      data: { ...transaction, rowNumber },
      message: "Transaksi tersimpan",
    };
  } catch {
    return { success: false, error: "Gagal menyimpan transaksi" };
  }
}

export async function updateFinanceTransaction(
  input: TUpdateFinanceTransaction,
): Promise<TServerPrompt<TFinanceTransaction>> {
  try {
    const dummyError = dummyModeError();
    if (dummyError) return dummyError;

    if (!(await canWriteFinance())) {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = updateFinanceTransactionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: fieldErrorsFrom(parsed.error),
      };
    }

    const snapshot = await getFinanceSnapshot();
    const current = snapshot.transactions.find(
      (transaction) => transaction.rowNumber === parsed.data.rowNumber,
    );
    if (!current) {
      return { success: false, error: "Transaksi tidak ditemukan" };
    }

    const transaction = toTransaction(
      parsed.data,
      current.no,
      current.rowNumber,
      current.bulanPelaporan,
    );
    await updateFinanceRow(
      current.rowNumber,
      buildFinanceSheetRow(transaction),
    );

    return {
      success: true,
      data: transaction,
      message: "Transaksi diperbarui",
    };
  } catch {
    return { success: false, error: "Gagal memperbarui transaksi" };
  }
}

export async function deleteFinanceTransaction(
  input: TDeleteFinanceTransaction,
): Promise<TServerPrompt<void>> {
  try {
    const dummyError = dummyModeError();
    if (dummyError) return dummyError;

    if (!(await canWriteFinance())) {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = deleteFinanceTransactionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: fieldErrorsFrom(parsed.error),
      };
    }

    const snapshot = await getFinanceSnapshot();
    const exists = snapshot.transactions.some(
      (transaction) => transaction.rowNumber === parsed.data.rowNumber,
    );
    if (!exists) {
      return { success: false, error: "Transaksi tidak ditemukan" };
    }

    await clearFinanceRow(parsed.data.rowNumber);

    return { success: true, data: undefined, message: "Nilai transaksi dikosongkan" };
  } catch {
    return { success: false, error: "Gagal menghapus transaksi" };
  }
}
