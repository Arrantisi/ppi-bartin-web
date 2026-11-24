import type {
  TBudgetRealization,
  TFinanceDashboardReport,
  TFinanceFund,
  TFinanceLegend,
  TFinanceTotals,
  TFinanceTransaction,
  TWajibKasBlock,
  TWajibKasMonth,
  TWajibKasReport,
  TArusKas,
  TMataUang,
} from "@/types/finance";

/** Baris pertama data di tab `BUKU BESAR KEUANGAN` (baris 1–7 adalah banner + header). */
export const FINANCE_DATA_START_ROW = 8;

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

type TFinanceCell = unknown;

type TParseRowsOptions = {
  /** Nomor baris Sheets untuk elemen pertama array. Default: 8. */
  firstRowNumber?: number;
};

const cellText = (value: TFinanceCell): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
};

const isRowEmpty = (row: readonly TFinanceCell[]): boolean =>
  row.every((cell) => cellText(cell) === "");

const pad = (value: number): string => String(value).padStart(2, "0");

const toIsoDate = (year: number, month: number, day: number): string | null => {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return `${year}-${pad(month)}-${pad(day)}`;
};

/**
 * Menerima `M/D/YYYY`, `MM/DD/YYYY`, `yyyy-MM-dd`, atau serial number Sheets.
 * Mengembalikan ISO `yyyy-MM-dd`, atau `null` kalau tidak valid.
 */
export function parseFinanceDate(value: TFinanceCell): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    const epoch = Date.UTC(1899, 11, 30);
    const date = new Date(epoch + Math.round(value) * 86_400_000);
    return toIsoDate(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
    );
  }

  const raw = cellText(value);
  if (!raw) return null;

  const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    return toIsoDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));
  }

  const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) {
    return toIsoDate(Number(slash[3]), Number(slash[1]), Number(slash[2]));
  }

  return null;
}

/** Nama bulan Indonesia dari tanggal ISO, dipakai saat kolom C kosong. */
export function monthNameFromIsoDate(isoDate: string): string {
  const month = Number(isoDate.slice(5, 7));
  return INDONESIAN_MONTHS[month - 1] ?? "";
}

/**
 * Membersihkan format asli sheet menjadi number:
 * `Rp10,242,331` (koma ribuan), `Rp45.000` (titik ribuan),
 * `₺450.00` (titik desimal) dan `₺1.500,00` (titik ribuan + koma desimal).
 */
export function parseFinanceCurrency(
  value: TFinanceCell,
  currency: TMataUang,
): number {
  const raw = cellText(value);
  if (!raw) return 0;

  let body = raw
    .replace(/[\u00a0\s]/g, "")
    .replace(/(rp|idr|try|₺)/gi, "")
    .replace(/[^0-9.,-]/g, "");

  const negative = body.startsWith("-");
  body = body.replace(/-/g, "");
  if (!body || !/\d/.test(body)) return 0;

  const dotCount = (body.match(/\./g) ?? []).length;
  const commaCount = (body.match(/,/g) ?? []).length;

  let normalized: string;
  if (dotCount > 0 && commaCount > 0) {
    const decimalSeparator = body.lastIndexOf(".") > body.lastIndexOf(",") ? "." : ",";
    const thousandSeparator = decimalSeparator === "." ? "," : ".";
    normalized = body
      .split(thousandSeparator)
      .join("")
      .replace(decimalSeparator, ".");
  } else if (commaCount > 1) {
    normalized = body.replace(/,/g, "");
  } else if (dotCount > 1) {
    normalized = body.replace(/\./g, "");
  } else if (commaCount === 1) {
    const trailing = body.slice(body.lastIndexOf(",") + 1);
    normalized =
      currency === "IDR" || /^\d{3}$/.test(trailing)
        ? body.replace(",", "")
        : body.replace(",", ".");
  } else if (dotCount === 1) {
    const trailing = body.slice(body.lastIndexOf(".") + 1);
    normalized =
      currency === "IDR" || /^\d{3}$/.test(trailing)
        ? body.replace(".", "")
        : body;
  } else {
    normalized = body;
  }

  const amount = Number(normalized);
  if (!Number.isFinite(amount)) return 0;

  const rounded = Math.round(amount * 100) / 100;
  return negative ? -rounded : rounded;
}

/** Mengambil URL http(s) dari URL plain atau rumus `=HYPERLINK("url";"label")`. */
export function parseFinanceDocumentLink(value: TFinanceCell): string {
  const raw = cellText(value);
  if (!raw) return "";

  const hyperlink = raw.match(/^=HYPERLINK\s*\(\s*(["'])(.*?)\1/i);
  const candidate = hyperlink?.[2] ?? raw;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

const parseArusKas = (value: TFinanceCell): TArusKas | null => {
  const raw = cellText(value).toLowerCase();
  if (raw === "debit" || raw === "masuk" || raw === "pemasukan") return "Debit";
  if (raw === "kredit" || raw === "keluar" || raw === "pengeluaran") {
    return "Kredit";
  }
  return null;
};

const parseMataUang = (value: TFinanceCell): TMataUang | null => {
  const raw = cellText(value).toUpperCase();
  if (raw === "TRY" || raw.includes("LIRA")) return "TRY";
  if (raw === "IDR" || raw.includes("RUPIAH")) return "IDR";
  return null;
};

/**
 * Parse baris data `BUKU BESAR KEUANGAN` (tanpa banner/header) menjadi transaksi.
 * Baris dengan tanggal, arus kas, atau mata uang tidak valid dilewati.
 */
export function parseFinanceRows(
  rows: readonly (readonly TFinanceCell[])[],
  options: TParseRowsOptions = {},
): TFinanceTransaction[] {
  const firstRowNumber = options.firstRowNumber ?? FINANCE_DATA_START_ROW;

  return rows.flatMap((row, index) => {
    if (isRowEmpty(row)) return [];

    const tanggal = parseFinanceDate(row[1]);
    const arusKas = parseArusKas(row[5]);
    const mataUang = parseMataUang(row[6]);
    if (!tanggal || !arusKas || !mataUang) return [];

    const noCell = Number(cellText(row[0]));
    const nominalTry = parseFinanceCurrency(row[7], "TRY");
    const nominalIdr = parseFinanceCurrency(row[8], "IDR");

    return [
      {
        rowNumber: firstRowNumber + index,
        no: Number.isInteger(noCell) && noCell > 0 ? noCell : index + 1,
        tanggal,
        bulanPelaporan: cellText(row[2]) || monthNameFromIsoDate(tanggal),
        keterangan: cellText(row[3]),
        kategori: cellText(row[4]),
        arusKas,
        mataUang,
        nominalTry,
        nominalIdr,
        metodeTransaksi: cellText(row[9]),
        penanggungJawab: cellText(row[10]),
        rekeningPenampung: cellText(row[11]),
        penerima: cellText(row[12]),
        pengirim: cellText(row[13]),
        tautanDokumen: parseFinanceDocumentLink(row[14]),
      },
    ];
  });
}

/**
 * Helper untuk hasil `values.get` penuh A:P: memotong baris 1–7 sebelum parsing.
 * Kalau sudah mengambil `B8:P`, gunakan `parseFinanceRows` langsung.
 */
export function parseFinanceSheetValues(
  rows: readonly (readonly TFinanceCell[])[],
  headerRowCount = 7,
): TFinanceTransaction[] {
  return parseFinanceRows(rows.slice(headerRowCount), {
    firstRowNumber: headerRowCount + 1,
  });
}

/**
 * Baris kosong pertama setelah data terakhir pada rentang C:P.
 * Baris yang hanya berisi NO dari `=sequence(250)` tidak dihitung sebagai data.
 */
export function findNextFinanceRow(
  rows: readonly (readonly TFinanceCell[])[],
  firstRowNumber = FINANCE_DATA_START_ROW,
): number {
  let lastDataIndex = -1;
  rows.forEach((row, index) => {
    if (row.some((cell) => cellText(cell) !== "")) lastDataIndex = index;
  });
  return firstRowNumber + lastDataIndex + 1;
}

const roundCurrency = (value: number): number =>
  Math.round(value * 100) / 100;

/** Total per mata uang. Sengaja tidak dikonversi karena sheet tidak punya kurs. */
export function computeFinanceTotals(
  transactions: readonly TFinanceTransaction[],
): TFinanceTotals {
  const sum = (mataUang: TMataUang, arusKas: TArusKas): number =>
    roundCurrency(
      transactions
        .filter(
          (transaction) =>
            transaction.mataUang === mataUang &&
            transaction.arusKas === arusKas,
        )
        .reduce(
          (total, transaction) =>
            total +
            (mataUang === "TRY"
              ? transaction.nominalTry
              : transaction.nominalIdr),
          0,
        ),
    );

  const pemasukanIdr = sum("IDR", "Debit");
  const pengeluaranIdr = sum("IDR", "Kredit");
  const pemasukanTry = sum("TRY", "Debit");
  const pengeluaranTry = sum("TRY", "Kredit");

  return {
    pemasukanIdr,
    pengeluaranIdr,
    saldoIdr: roundCurrency(pemasukanIdr - pengeluaranIdr),
    pemasukanTry,
    pengeluaranTry,
    saldoTry: roundCurrency(pemasukanTry - pengeluaranTry),
  };
}

/**
 * Mengambil satu sel dari hasil `values.get`.
 * Baris memakai nomor sheet 1-based, kolom 0-based (A = 0).
 */
const sheetCell = (
  rows: readonly (readonly TFinanceCell[])[],
  row: number,
  column: number,
): TFinanceCell => rows[row - 1]?.[column] ?? "";

/**
 * Parse blok ringkasan dari tab `DASHBOARD` bendahara.
 *
 * Layout asli yang dipakai:
 * - saldo dana: label baris 8, IDR baris 10, TRY baris 12 pada kolom E/J/S;
 * - arus kas: label baris 15, IDR baris 17, TRY baris 19 pada kolom E/J/S;
 * - legenda: E23:F25;
 * - penyerapan anggaran: header baris 30, data baris 32, 34, … dengan
 *   NO di E, LEMBAGA di F/G, PAGU di M, REALISASI di S, SISA di Y.
 *
 * Mengembalikan `null` kalau tidak ada angka sama sekali, supaya caller bisa
 * jatuh ke perhitungan buku besar tanpa menampilkan kartu kosong.
 */
export function parseFinanceDashboardReport(
  rows: readonly (readonly TFinanceCell[])[],
): TFinanceDashboardReport | null {
  const fundKeys = ["lembaga", "darurat", "abadi"] as const;
  const fundLabels = [
    "Saldo Dana Lembaga",
    "Saldo Dana Darurat",
    "Saldo Dana Abadi",
  ] as const;
  const fundMarkers = ["*", "**", "***"] as const;
  // Kolom E, J, S pada sheet.
  const summaryColumns = [4, 9, 18] as const;

  const funds: TFinanceFund[] = fundKeys.map((key, index) => ({
    key,
    label: fundLabels[index],
    marker: fundMarkers[index],
    idr: parseFinanceCurrency(
      sheetCell(rows, 10, summaryColumns[index]),
      "IDR",
    ),
    try: parseFinanceCurrency(
      sheetCell(rows, 12, summaryColumns[index]),
      "TRY",
    ),
  }));

  const totals: TFinanceTotals = {
    pemasukanIdr: parseFinanceCurrency(sheetCell(rows, 17, 4), "IDR"),
    pengeluaranIdr: parseFinanceCurrency(sheetCell(rows, 17, 9), "IDR"),
    saldoIdr: parseFinanceCurrency(sheetCell(rows, 17, 18), "IDR"),
    pemasukanTry: parseFinanceCurrency(sheetCell(rows, 19, 4), "TRY"),
    pengeluaranTry: parseFinanceCurrency(sheetCell(rows, 19, 9), "TRY"),
    saldoTry: parseFinanceCurrency(sheetCell(rows, 19, 18), "TRY"),
  };

  const budget: TBudgetRealization[] = [];
  for (let row = 32; row <= rows.length; row += 2) {
    const no = Number(cellText(sheetCell(rows, row, 4)));
    const lembaga = cellText(sheetCell(rows, row, 5));
    const unit = cellText(sheetCell(rows, row, 6));
    const label = lembaga || unit;
    if (!Number.isInteger(no) || no <= 0 || !label) continue;

    const pagu = parseFinanceCurrency(sheetCell(rows, row, 12), "IDR");
    const realisasi = parseFinanceCurrency(sheetCell(rows, row, 18), "IDR");
    const sisaCell = parseFinanceCurrency(sheetCell(rows, row, 24), "IDR");

    budget.push({
      no,
      lembaga: label,
      unit: lembaga ? unit : "",
      pagu,
      realisasi,
      // Kolom Y adalah rumus; kalau belum terhitung, turunkan dari Pagu − Realisasi.
      sisa: sisaCell || roundCurrency(pagu - realisasi),
    });
  }

  const legend: TFinanceLegend[] = [23, 24, 25].flatMap((row) => {
    const marker = cellText(sheetCell(rows, row, 4));
    const description = cellText(sheetCell(rows, row, 5));
    return marker && description ? [{ marker, description }] : [];
  });

  const hasData =
    funds.some((fund) => fund.idr !== 0 || fund.try !== 0) ||
    budget.length > 0 ||
    Object.values(totals).some((value) => value !== 0);
  if (!hasData) return null;

  return {
    title: cellText(sheetCell(rows, 1, 1)),
    department: cellText(sheetCell(rows, 2, 1)),
    period: cellText(sheetCell(rows, 3, 1)),
    funds,
    legend,
    totals,
    budget,
  };
}

/** Dua lajur blok pada tab `WAJIB KAS`: kiri B:R dan kanan T:AJ. */
const WAJIB_KAS_LANES = [
  { no: 1, angkatan: 2, nama: 3, monthStart: 4, tunggakan: 16 },
  { no: 19, angkatan: 20, nama: 21, monthStart: 22, tunggakan: 34 },
] as const;

const WAJIB_KAS_MONTHS = [
  "FEB",
  "MAR",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AGU",
  "SEP",
  "OKT",
  "NOV",
  "DES",
  "JAN",
] as const;

const isKasPaid = (value: TFinanceCell): boolean => {
  if (typeof value === "boolean") return value;
  const raw = cellText(value).toUpperCase();
  return raw === "TRUE" || raw === "1" || raw === "✓" || raw === "LUNAS";
};

/**
 * Parse tab `WAJIB KAS` bendahara menjadi blok angkatan dan status per anggota.
 *
 * Setiap lajur diawali baris `Penanggung Jawab :`, lalu header `NO | ANGKATAN |
 * NAMA | 12 bulan | TUNGGAKAN`. Baris tanpa ketiga field utama diabaikan,
 * sehingga header dan baris kosong tidak masuk ke hasil.
 */
export function parseWajibKasReport(
  rows: readonly (readonly TFinanceCell[])[],
): TWajibKasReport | null {
  const blocks: TWajibKasBlock[] = [];

  WAJIB_KAS_LANES.forEach((lane) => {
    let current: TWajibKasBlock | null = null;

    rows.forEach((row, index) => {
      const rowNumber = index + 1;
      const marker = cellText(sheetCell(rows, rowNumber, lane.no));

      if (marker === "Penanggung Jawab :") {
        current = {
          penanggungJawab: cellText(sheetCell(rows, rowNumber, lane.nama)),
          members: [],
        };
        blocks.push(current);
        return;
      }

      if (!current) return;

      const no = Number(marker);
      const angkatan = Number(
        cellText(sheetCell(rows, rowNumber, lane.angkatan)),
      );
      const nama = cellText(sheetCell(rows, rowNumber, lane.nama));
      if (!Number.isInteger(no) || no <= 0) return;
      if (!Number.isInteger(angkatan) || angkatan < 1900) return;
      if (!nama) return;

      const months: TWajibKasMonth[] = WAJIB_KAS_MONTHS.map(
        (fallbackLabel, offset) => ({
          label:
            cellText(sheetCell(rows, 8, lane.monthStart + offset)) ||
            fallbackLabel,
          paid: isKasPaid(
            sheetCell(rows, rowNumber, lane.monthStart + offset),
          ),
        }),
      );

      const unpaidMonths = months.filter((month) => !month.paid).length;
      const tunggakanText = cellText(
        sheetCell(rows, rowNumber, lane.tunggakan),
      );
      const rawTunggakan =
        tunggakanText === "" ? Number.NaN : Number(tunggakanText);
      const tunggakan = Number.isFinite(rawTunggakan)
        ? rawTunggakan
        : unpaidMonths;

      current.members.push({
        no,
        angkatan,
        nama,
        months,
        tunggakan,
        status: tunggakan > 0 ? "tunggakan" : "lunas",
      });
    });
  });

  const filledBlocks = blocks
    .filter((block) => block.members.length > 0)
    // Sheet menyusun dua lajur bersebelahan; urutkan kembali oleh angkatan
    // supaya blok 2020, 2021, 2022, … tampil berurutan di UI.
    .sort(
      (a, b) =>
        a.members[0].angkatan - b.members[0].angkatan ||
        a.members[0].no - b.members[0].no,
    );
  if (filledBlocks.length === 0) return null;

  const members = filledBlocks.flatMap((block) => block.members);
  return {
    title: cellText(sheetCell(rows, 1, 1)),
    department: cellText(sheetCell(rows, 2, 1)),
    period: cellText(sheetCell(rows, 3, 1)),
    blocks: filledBlocks,
    summary: {
      total: members.length,
      lunas: members.filter((member) => member.status === "lunas").length,
      tunggakan: members.filter((member) => member.status === "tunggakan")
        .length,
    },
  };
}

/** Format angka sesuai mata uang sheet (IDR tanpa desimal, TRY dua desimal). */
export function formatFinanceAmount(
  value: number,
  currency: TMataUang,
): string {
  if (currency === "IDR") {
    return `Rp${value.toLocaleString("id-ID")}`;
  }

  return `₺${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Format tanggal ISO → `M/D/YYYY` sesuai sheet bendahara. */
export function formatDateForSheet(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${month}/${day}/${year}`;
}

/** Mencegah user input dieksekusi sebagai rumus saat ditulis ke Sheets. */
export function escapeFinanceCell(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

/**
 * Nilai untuk kolom C:P. Kolom A (spacer) dan B (NO dari `=sequence(250)`)
 * sengaja tidak ditulis supaya nomor otomatis bendahara tetap bekerja.
 */
export function buildFinanceSheetRow(
  transaction: TFinanceTransaction,
): string[] {
  return [
    formatDateForSheet(transaction.tanggal),
    transaction.bulanPelaporan,
    escapeFinanceCell(transaction.keterangan),
    escapeFinanceCell(transaction.kategori),
    transaction.arusKas,
    transaction.mataUang,
    transaction.mataUang === "TRY" ? `₺${transaction.nominalTry}` : "",
    transaction.mataUang === "IDR" ? `Rp${transaction.nominalIdr}` : "",
    transaction.metodeTransaksi,
    transaction.penanggungJawab,
    transaction.rekeningPenampung,
    escapeFinanceCell(transaction.penerima),
    escapeFinanceCell(transaction.pengirim),
    transaction.tautanDokumen,
  ];
}
