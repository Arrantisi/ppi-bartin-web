import { describe, expect, it } from "vitest";

import {
  buildFinanceSheetRow,
  computeFinanceTotals,
  formatFinanceAmount,
  parseFinanceCurrency,
  parseFinanceDate,
  parseFinanceDocumentLink,
  parseFinanceRows,
  parseFinanceSheetValues,
} from "../utils/finance-parser";

const headerRows = [
  ["BUKU BESAR KEUANGAN PPI BARTIN"],
  [],
  ["DKE - DATA KEUANGAN KESELURUHAN PPI BARTIN"],
  [],
  ["NO", "TANGGAL", "BULAN PELAPORAN"],
  ["NO", "TANGGAL", "BULAN PELAPORAN", "KATEGORI", "NOMINAL"],
];

const sampleRows = [
  [
    "1",
    "3/15/2026",
    "Maret",
    "Penerimaan Dana Hibah dari PPI Turki",
    "Sponsorship/Pendapatan Eksternal",
    "Debit",
    "TRY",
    "₺490,00",
    "",
    "Cash",
    "Sandy",
    "Uang Fundraise",
    "",
    "Dafa",
    "https://drive.google.com/file/d/hibah/view",
  ],
  [
    "2",
    "3/18/2026",
    "Maret",
    "Pengembalian Dana SUKA Rupiah dari kepengurusan sebelumnya",
    "Dana SUKA",
    "Debit",
    "IDR",
    "",
    "Rp10.242.331",
    "Transfer",
    "Dafa",
    "Rekening Iuran Kas Rupiah",
    "Qisthi",
    "Hanifa",
    "https://drive.google.com/file/d/suka-idr/view",
  ],
  [
    "3",
    "3/22/2026",
    "Maret",
    "Penerimaan Dana SUKA Lira Sisa dari kepengurusan sebelumnya",
    "Dana SUKA",
    "Debit",
    "TRY",
    "₺1.500,00",
    "",
    "Transfer",
    "Dafa",
    "Rekening Iuran Kas Lira",
    "Daniah",
    "Winda",
    '=HYPERLINK("https://drive.google.com/file/d/suka-try/view";"Nota")',
  ],
];

describe("finance parser", () => {
  it("melewati banner/header dan mem-parsing 3 baris contoh bendahara", () => {
    const transactions = parseFinanceSheetValues([...headerRows, ...sampleRows]);

    expect(transactions).toHaveLength(3);
    expect(transactions[0]).toMatchObject({
      rowNumber: 7,
      no: 1,
      tanggal: "2026-03-15",
      bulanPelaporan: "Maret",
      arusKas: "Debit",
      mataUang: "TRY",
      nominalTry: 490,
      nominalIdr: 0,
      penanggungJawab: "Sandy",
      pengirim: "Dafa",
      tautanDokumen: "https://drive.google.com/file/d/hibah/view",
    });
    expect(transactions[1]).toMatchObject({
      rowNumber: 8,
      tanggal: "2026-03-18",
      mataUang: "IDR",
      nominalTry: 0,
      nominalIdr: 10_242_331,
      penerima: "Qisthi",
      pengirim: "Hanifa",
    });
    expect(transactions[2]).toMatchObject({
      rowNumber: 9,
      tanggal: "2026-03-22",
      nominalTry: 1500,
      tautanDokumen: "https://drive.google.com/file/d/suka-try/view",
    });
  });

  it("memformat angka sesuai mata uang", () => {
    expect(formatFinanceAmount(10_242_331, "IDR")).toBe("Rp10.242.331");
    expect(formatFinanceAmount(1500, "TRY")).toMatch(/^₺1\.500[,.]00$/);
  });

  it("membersihkan format mata uang TRY dan IDR", () => {
    expect(parseFinanceCurrency("₺490,00", "TRY")).toBe(490);
    expect(parseFinanceCurrency("₺1.500,00", "TRY")).toBe(1500);
    expect(parseFinanceCurrency("Rp45.000", "IDR")).toBe(45000);
    expect(parseFinanceCurrency("Rp10.242.331", "IDR")).toBe(10_242_331);
    expect(parseFinanceCurrency("", "TRY")).toBe(0);
  });

  it("mengonversi tanggal M/D/YYYY dan serial number Sheets", () => {
    expect(parseFinanceDate("3/15/2026")).toBe("2026-03-15");
    expect(parseFinanceDate("03/22/2026")).toBe("2026-03-22");
    expect(parseFinanceDate("2026-04-01")).toBe("2026-04-01");
    expect(parseFinanceDate(46096)).toBe("2026-03-15");
    expect(parseFinanceDate("31/02/2026")).toBeNull();
  });

  it("hanya menerima URL http(s) dari rumus HYPERLINK", () => {
    expect(parseFinanceDocumentLink('=HYPERLINK("https://a.test/x";"Nota")')).toBe(
      "https://a.test/x",
    );
    expect(parseFinanceDocumentLink("=HYPERLINK(\"javascript:alert(1)\")")).toBe(
      "",
    );
  });

  it("menghitung total terpisah untuk IDR dan TRY", () => {
    const transactions = parseFinanceRows(sampleRows);
    transactions.push({
      ...transactions[0],
      rowNumber: 10,
      arusKas: "Kredit",
      nominalTry: 250.5,
    });

    expect(computeFinanceTotals(transactions)).toEqual({
      pemasukanIdr: 10_242_331,
      pengeluaranIdr: 0,
      saldoIdr: 10_242_331,
      pemasukanTry: 1990,
      pengeluaranTry: 250.5,
      saldoTry: 1739.5,
    });
  });

  it("membuat baris A:O dengan nominal sesuai mata uang", () => {
    const [transaction] = parseFinanceRows(sampleRows);

    expect(buildFinanceSheetRow(transaction)).toEqual([
      "1",
      "3/15/2026",
      "Maret",
      "Penerimaan Dana Hibah dari PPI Turki",
      "Sponsorship/Pendapatan Eksternal",
      "Debit",
      "TRY",
      "₺490",
      "",
      "Cash",
      "Sandy",
      "Uang Fundraise",
      "",
      "Dafa",
      "https://drive.google.com/file/d/hibah/view",
    ]);
  });
});
