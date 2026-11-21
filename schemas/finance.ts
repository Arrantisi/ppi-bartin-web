import * as z from "zod";

import { parseFinanceDate } from "@/utils/finance-parser";

const financeDateSchema = z
  .string()
  .refine(
    (value) => parseFinanceDate(value) !== null,
    "Format tanggal harus yyyy-MM-dd",
  );

const financeArusKasSchema = z.enum(["Debit", "Kredit"]);
const financeMataUangSchema = z.enum(["TRY", "IDR"]);

const financeNominalSchema = z
  .number({ error: "Nominal harus berupa angka" })
  .nonnegative("Nominal tidak boleh negatif")
  .optional();

const financeDocumentLinkSchema = z
  .string()
  .refine(
    (value) => value === "" || /^https?:\/\//i.test(value),
    "Tautan dokumen harus URL http(s)",
  )
  .optional();

const financeBaseSchema = z.object({
  tanggal: financeDateSchema,
  keterangan: z.string().min(2, "Keterangan minimal 2 karakter"),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  arusKas: financeArusKasSchema,
  mataUang: financeMataUangSchema,
  nominalTry: financeNominalSchema,
  nominalIdr: financeNominalSchema,
  metodeTransaksi: z.string().min(1, "Metode transaksi wajib diisi"),
  penanggungJawab: z.string().min(1, "Penanggung jawab wajib diisi"),
  rekeningPenampung: z.string().min(1, "Rekening penampung wajib diisi"),
  penerima: z.string().optional(),
  pengirim: z.string().optional(),
  tautanDokumen: financeDocumentLinkSchema,
});

const validNominalForCurrency = (
  data: z.infer<typeof financeBaseSchema>,
): boolean =>
  data.mataUang === "TRY"
    ? (data.nominalTry ?? 0) > 0 && (data.nominalIdr ?? 0) === 0
    : (data.nominalIdr ?? 0) > 0 && (data.nominalTry ?? 0) === 0;

export const createFinanceTransactionSchema = financeBaseSchema.refine(
  validNominalForCurrency,
  { error: "Isi nominal sesuai mata uang yang dipilih" },
);

export const updateFinanceTransactionSchema = financeBaseSchema
  .extend({
    rowNumber: z
      .number({ error: "Baris harus berupa angka" })
      .int("Baris harus bilangan bulat")
      .positive("Baris tidak valid"),
  })
  .refine(validNominalForCurrency, {
    error: "Isi nominal sesuai mata uang yang dipilih",
  });

export const deleteFinanceTransactionSchema = z.object({
  rowNumber: z
    .number({ error: "Baris harus berupa angka" })
    .int("Baris harus bilangan bulat")
    .positive("Baris tidak valid"),
});

export type TCreateFinanceTransaction = z.infer<
  typeof createFinanceTransactionSchema
>;
export type TUpdateFinanceTransaction = z.infer<
  typeof updateFinanceTransactionSchema
>;
export type TDeleteFinanceTransaction = z.infer<
  typeof deleteFinanceTransactionSchema
>;

/** Alias sesuai konvensi nama di plan file. */
export type CreateFinanceTransactionSchema = TCreateFinanceTransaction;
export type UpdateFinanceTransactionSchema = TUpdateFinanceTransaction;
export type DeleteFinanceTransactionSchema = TDeleteFinanceTransaction;
