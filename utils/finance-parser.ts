import type {
  TArusKas,
  TFinanceTotals,
  TFinanceTransaction,
  TMataUang,
} from "@/types/finance";

/** Baris pertama data di tab `BUKU BESAR KEUANGAN` (baris 1–6 adalah banner + header). */
export const FINANCE_DATA_START_ROW = 7;

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
  /** Nomor baris Sheets untuk elemen pertama array. Default: 7. */
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
 * Membersihkan `Rp10.242.331`, `₺1.500,00`, `Rp45.000`, dll. menjadi number.
 * Titik diperlakukan sebagai pemisah ribuan; koma sebagai pemisah desimal.
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

  const lastDot = body.lastIndexOf(".");
  const lastComma = body.lastIndexOf(",");

  let normalized: string;
  if (lastDot !== -1 && lastComma !== -1) {
    const decimalSeparator = lastDot > lastComma ? "." : ",";
    const thousandSeparator = decimalSeparator === "." ? "," : ".";
    normalized = body
      .split(thousandSeparator)
      .join("")
      .replace(decimalSeparator, ".");
  } else if (lastComma !== -1) {
    normalized = body.replace(/,/g, ".");
  } else if (lastDot !== -1) {
    const digitsAfterDot = body.slice(lastDot + 1);
    const dotCount = body.split(".").length - 1;
    const looksDecimal =
      dotCount === 1 && /^\d{1,2}$/.test(digitsAfterDot) && currency === "TRY";
    normalized = looksDecimal ? body : body.replace(/\./g, "");
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
 * Helper untuk hasil `values.get` penuh A:O: memotong baris 1–6 sebelum parsing.
 * Kalau sudah mengambil `A7:O`, gunakan `parseFinanceRows` langsung.
 */
export function parseFinanceSheetValues(
  rows: readonly (readonly TFinanceCell[])[],
  headerRowCount = 6,
): TFinanceTransaction[] {
  return parseFinanceRows(rows.slice(headerRowCount), {
    firstRowNumber: headerRowCount + 1,
  });
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

export function buildFinanceSheetRow(
  transaction: TFinanceTransaction,
): string[] {
  return [
    String(transaction.no),
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
