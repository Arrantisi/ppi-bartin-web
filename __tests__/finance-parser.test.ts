import { describe, expect, it } from "vitest";

import {
  buildFinanceSheetRow,
  computeFinanceTotals,
  findNextFinanceRow,
  formatFinanceAmount,
  parseFinanceCurrency,
  parseFinanceDashboardReport,
  parseFinanceDate,
  parseFinanceDocumentLink,
  parseFinanceRows,
  parseFinanceSheetValues,
  parseWajibKasReport,
} from "../utils/finance-parser";

/** Baris 1–7: banner, header utama, dan subheader NOMINAL/PENERIMA-PENGIRIM. */
const headerRows = [
  ["BUKU BESAR KEUANGAN PPI BARTIN"],
  [],
  ["PERIODE 2026 - 2027"],
  [],
  [],
  ["NO", "TANGGAL", "BULAN PELAPORAN", "KETERANGAN TRANSAKSI", "KATEGORI", "ARUS KAS", "MATA UANG", "NOMINAL", "", "METODE TRANSAKSI", "PENANGGUNG JAWAB", "REKENING PENAMPUNG", "PIHAK EKSTERNAL", "", "TAUTAN NOTA/RESI"],
  ["", "", "", "", "", "", "", "TRY", "IDR", "", "", "", "PENERIMA", "PENGIRIM"],
];

/** Baris hasil `values.get` pada range B8:P, sesuai sheet bendahara. */
const sampleRows = [
  [
    "1",
    "3/15/2026",
    "Maret",
    "Penerimaan Dana Hibah dari PPI Turki",
    "Sponsorship/Pendapatan Eksternal",
    "Debit",
    "TRY",
    "₺450.00",
    "",
    "Cash",
    "Sandy",
    "Dana Fundriser",
    "",
    "Dapta",
    "https://drive.google.com/file/d/hibah/view",
  ],
  [
    "2",
    "3/18/2026",
    "Maret",
    "Penyerahan Dana SiLPA Rupiah (sisa dana kepengrusan sebelumnya)",
    "Dana SiLPA",
    "Debit",
    "IDR",
    "",
    "Rp10,242,331",
    "Transfer",
    "Clara",
    "Rekening Iuran Kas Rupiah",
    "Clara",
    "Hasrika",
    "https://drive.google.com/file/d/suka-idr/view",
  ],
  [
    "3",
    "3/22/2026",
    "Maret",
    "Penyerahan Dana SUKA Lira",
    "Dana SiLPA",
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

/** Hasil `values.get` pada range A1:Z80 sesuai layout DASHBOARD bendahara. */
const dashboardRows = (): unknown[][] => {
  const rows: unknown[][] = Array.from({ length: 80 }, () => []);
  const set = (row: number, column: number, value: unknown) => {
    rows[row - 1][column] = value;
  };

  set(1, 1, "DASHBOARD KEUANGAN PPI BARTIN");
  set(2, 1, "DEPARTEMEN KEUANGAN DAN EKONOMI - KABINET SUARASA");
  set(3, 1, "PERIODE 2026 - 2027");

  const columns = [4, 9, 18];
  ["Saldo Dana Lembaga*", "Saldo Dana Darurat**", "Saldo Dana Abadi***"].forEach(
    (label, index) => set(8, columns[index], label),
  );
  ["Rp3,685,969", "Rp1,100,697", "Rp555,348"].forEach((value, index) =>
    set(10, columns[index], value),
  );
  ["₺0.00", "₺0.00", "₺0.00"].forEach((value, index) =>
    set(12, columns[index], value),
  );

  set(17, 4, "Rp21,974,072.24");
  set(17, 9, "Rp11,320,813.46");
  set(17, 18, "IDR 10,653,258.78");
  set(19, 4, "₺54,018.61");
  set(19, 9, "₺37,427.84");
  set(19, 18, "TRY 16.590,77");

  set(23, 4, "*");
  set(23, 5, "Dana untuk kegiatan lembaga");
  set(24, 4, "**");
  set(24, 5, "Dana untuk kondisi tak terduga");
  set(25, 4, "***");
  set(25, 5, "Jaring pengaman awal kas");

  set(30, 4, "NO");
  set(32, 4, "1");
  set(32, 5, "Badan Pengurus Harian");
  set(32, 6, "Presidium");
  set(32, 11, "Rp");
  set(32, 12, "1,940,000.00");
  set(32, 17, "Rp");
  set(32, 18, "250,000.00");
  set(32, 23, "Rp");
  set(32, 24, "1,690,000.00");

  set(34, 4, "2");
  set(34, 6, "Departemen Sekretaris");
  set(34, 11, "Rp");
  set(34, 12, "1,280,000.00");
  set(34, 17, "Rp");
  set(34, 18, "941,358.00");
  set(34, 23, "Rp");
  set(34, 24, "338,642.00");

  return rows;
};

/** Hasil `values.get` pada range A1:AK140 sesuai layout WAJIB KAS bendahara. */
const wajibKasRows = (): unknown[][] => {
  const rows: unknown[][] = Array.from({ length: 20 }, () => []);
  const set = (row: number, column: number, value: unknown) => {
    rows[row - 1][column] = value;
  };

  set(1, 1, "DATA WAJIB KAS PPI BARTIN");
  set(2, 1, "DEPARTEMEN KEUANGAN DAN EKONOMI - KABINET SUARASA");
  set(3, 1, "PERIODE 2026 - 2027");

  const months = [
    "FEB", "MAR", "APR", "MEI", "JUN", "JUL",
    "AGU", "SEP", "OKT", "NOV", "DES", "JAN",
  ];
  months.forEach((label, index) => {
    set(8, 4 + index, label);
    set(8, 22 + index, label);
  });

  set(6, 1, "Penanggung Jawab :");
  set(6, 3, "Dinda Mahel Ihelga");
  set(6, 19, "Penanggung Jawab :");
  set(6, 21, "Clara Devi Prasetya Putri");
  set(7, 1, "NO");
  set(7, 2, "ANGKATAN");
  set(7, 3, "NAMA");
  set(7, 19, "NO");
  set(7, 20, "ANGKATAN");
  set(7, 21, "NAMA");

  // Blok kiri: satu lunas, satu tunggakan.
  set(9, 1, "1");
  set(9, 2, "2020");
  set(9, 3, "Anggota Satu");
  months.forEach((_, index) => set(9, 4 + index, "TRUE"));
  set(9, 16, "0");

  set(10, 1, "2");
  set(10, 2, "2020");
  set(10, 3, "Anggota Tiga");
  months.forEach((_, index) => set(10, 4 + index, "FALSE"));
  set(10, 16, "12");

  // Blok kanan: lunas 8 bulan, tunggakan 4 bulan.
  set(9, 19, "1");
  set(9, 20, "2021");
  set(9, 21, "Anggota Dua");
  months.forEach((_, index) => set(9, 22 + index, index < 8 ? "TRUE" : "FALSE"));
  set(9, 34, "4");

  // Blok kiri kedua: penanggung jawab berbeda.
  set(12, 1, "Penanggung Jawab :");
  set(12, 3, "Erika Azh Zahrah Khoirunnisa");
  set(13, 1, "1");
  set(13, 2, "2022");
  set(13, 3, "Anggota Empat");
  months.forEach((_, index) => set(13, 4 + index, true));
  set(13, 16, "0");

  return rows;
};

describe("finance parser", () => {
  it("melewati banner/header dan mem-parsing 3 baris asli bendahara", () => {
    const transactions = parseFinanceSheetValues([...headerRows, ...sampleRows]);

    expect(transactions).toHaveLength(3);
    expect(transactions[0]).toMatchObject({
      rowNumber: 8,
      no: 1,
      tanggal: "2026-03-15",
      bulanPelaporan: "Maret",
      arusKas: "Debit",
      mataUang: "TRY",
      nominalTry: 450,
      nominalIdr: 0,
      penanggungJawab: "Sandy",
      pengirim: "Dapta",
      tautanDokumen: "https://drive.google.com/file/d/hibah/view",
    });
    expect(transactions[1]).toMatchObject({
      rowNumber: 9,
      tanggal: "2026-03-18",
      mataUang: "IDR",
      nominalTry: 0,
      nominalIdr: 10_242_331,
      penerima: "Clara",
      pengirim: "Hasrika",
    });
    expect(transactions[2]).toMatchObject({
      rowNumber: 10,
      tanggal: "2026-03-22",
      nominalTry: 1500,
      tautanDokumen: "https://drive.google.com/file/d/suka-try/view",
    });
  });

  it("mem-parsing tanggal serial number dari API", () => {
    const [transaction] = parseFinanceRows([
      ["4", 46096, "Maret", "Transaksi serial", "Dana SiLPA", "Debit", "TRY", 1503.07, "", "Transfer", "Sandy", "Rekening Iuran Kas Lira", "", "Wanda", ""],
    ]);
    expect(transaction).toMatchObject({
      tanggal: "2026-03-15",
      nominalTry: 1503.07,
    });
  });

  it("memformat angka sesuai mata uang", () => {
    expect(formatFinanceAmount(10_242_331, "IDR")).toBe("Rp10.242.331");
    expect(formatFinanceAmount(1500, "TRY")).toMatch(/^₺1\.500[,.]00$/);
  });

  it("membersihkan format mata uang asli sheet", () => {
    expect(parseFinanceCurrency("₺450.00", "TRY")).toBe(450);
    expect(parseFinanceCurrency("₺490,00", "TRY")).toBe(490);
    expect(parseFinanceCurrency("₺1.500,00", "TRY")).toBe(1500);
    expect(parseFinanceCurrency("₺1.503,07", "TRY")).toBe(1503.07);
    expect(parseFinanceCurrency("Rp45.000", "IDR")).toBe(45000);
    expect(parseFinanceCurrency("Rp10.242.331", "IDR")).toBe(10_242_331);
    expect(parseFinanceCurrency("Rp10,242,331", "IDR")).toBe(10_242_331);
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
    expect(parseFinanceDocumentLink('=HYPERLINK("javascript:alert(1)")')).toBe(
      "",
    );
  });

  it("menghitung total terpisah untuk IDR dan TRY", () => {
    const transactions = parseFinanceRows(sampleRows);
    transactions.push({
      ...transactions[0],
      rowNumber: 11,
      arusKas: "Kredit",
      nominalTry: 250.5,
    });

    expect(computeFinanceTotals(transactions)).toEqual({
      pemasukanIdr: 10_242_331,
      pengeluaranIdr: 0,
      saldoIdr: 10_242_331,
      pemasukanTry: 1950,
      pengeluaranTry: 250.5,
      saldoTry: 1699.5,
    });
  });

  it("memilih baris kosong pertama setelah data terakhir", () => {
    const rowsFromSheet = [
      ...sampleRows,
      ...Array.from({ length: 247 }, () => []),
    ];
    expect(findNextFinanceRow(rowsFromSheet)).toBe(11);
    expect(findNextFinanceRow([[], [], []])).toBe(8);
  });

  it("membuat baris C:P tanpa menimpa NO otomatis di kolom B", () => {
    const [transaction] = parseFinanceRows(sampleRows);

    expect(buildFinanceSheetRow(transaction)).toEqual([
      "3/15/2026",
      "Maret",
      "Penerimaan Dana Hibah dari PPI Turki",
      "Sponsorship/Pendapatan Eksternal",
      "Debit",
      "TRY",
      "₺450",
      "",
      "Cash",
      "Sandy",
      "Dana Fundriser",
      "",
      "Dapta",
      "https://drive.google.com/file/d/hibah/view",
    ]);
  });

  it("mem-parsing blok DASHBOARD asli: dana, arus kas, legenda, dan anggaran", () => {
    const report = parseFinanceDashboardReport(dashboardRows());

    expect(report).not.toBeNull();
    expect(report).toMatchObject({
      title: "DASHBOARD KEUANGAN PPI BARTIN",
      department: "DEPARTEMEN KEUANGAN DAN EKONOMI - KABINET SUARASA",
      period: "PERIODE 2026 - 2027",
    });
    expect(report?.funds).toEqual([
      { key: "lembaga", label: "Saldo Dana Lembaga", marker: "*", idr: 3_685_969, try: 0 },
      { key: "darurat", label: "Saldo Dana Darurat", marker: "**", idr: 1_100_697, try: 0 },
      { key: "abadi", label: "Saldo Dana Abadi", marker: "***", idr: 555_348, try: 0 },
    ]);
    expect(report?.totals).toEqual({
      pemasukanIdr: 21_974_072.24,
      pengeluaranIdr: 11_320_813.46,
      saldoIdr: 10_653_258.78,
      pemasukanTry: 54_018.61,
      pengeluaranTry: 37_427.84,
      saldoTry: 16_590.77,
    });
    expect(report?.legend).toHaveLength(3);
    expect(report?.budget).toEqual([
      {
        no: 1,
        lembaga: "Badan Pengurus Harian",
        unit: "Presidium",
        pagu: 1_940_000,
        realisasi: 250_000,
        sisa: 1_690_000,
      },
      {
        no: 2,
        lembaga: "Departemen Sekretaris",
        unit: "",
        pagu: 1_280_000,
        realisasi: 941_358,
        sisa: 338_642,
      },
    ]);
  });

  it("memakai Pagu − Realisasi bila sel SISA Anggaran kosong", () => {
    const rows = dashboardRows();
    rows[31][24] = "";

    expect(parseFinanceDashboardReport(rows)?.budget[0].sisa).toBe(1_690_000);
  });

  it("mengembalikan null bila DASHBOARD tidak berisi angka", () => {
    expect(
      parseFinanceDashboardReport(Array.from({ length: 80 }, () => [])),
    ).toBeNull();
  });

  it("mem-parsing dua lajur WAJIB KAS menjadi blok dan status anggota", () => {
    const report = parseWajibKasReport(wajibKasRows());

    expect(report).toMatchObject({
      title: "DATA WAJIB KAS PPI BARTIN",
      department: "DEPARTEMEN KEUANGAN DAN EKONOMI - KABINET SUARASA",
      period: "PERIODE 2026 - 2027",
      summary: { total: 4, lunas: 2, tunggakan: 2 },
    });
    expect(report?.blocks).toHaveLength(3);
    expect(report?.blocks.map((block) => block.penanggungJawab)).toEqual([
      "Dinda Mahel Ihelga",
      "Clara Devi Prasetya Putri",
      "Erika Azh Zahrah Khoirunnisa",
    ]);
    expect(report?.blocks[0].members).toHaveLength(2);
    expect(report?.blocks[1].members[0]).toMatchObject({
      no: 1,
      angkatan: 2021,
      nama: "Anggota Dua",
      tunggakan: 4,
      status: "tunggakan",
    });
    expect(report?.blocks[1].members[0].months).toHaveLength(12);
    expect(report?.blocks[1].members[0].months[0]).toEqual({
      label: "FEB",
      paid: true,
    });
    expect(report?.blocks[1].members[0].months[11]).toEqual({
      label: "JAN",
      paid: false,
    });
    expect(report?.blocks[2].members[0].status).toBe("lunas");
  });

  it("menghitung ulang tunggakan bila sel TUNGGAKAN kosong atau bukan angka", () => {
    const rows = wajibKasRows();
    rows[8][16] = "";
    rows[8][4] = "tidak terbaca";

    const member = parseWajibKasReport(rows)?.blocks[0].members[0];
    expect(member?.tunggakan).toBe(1);
    expect(member?.months[0].paid).toBe(false);
  });

  it("mengembalikan null bila tab WAJIB KAS kosong", () => {
    expect(parseWajibKasReport([])).toBeNull();
  });
});
