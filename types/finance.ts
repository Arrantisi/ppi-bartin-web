export type TMataUang = "TRY" | "IDR";

export type TArusKas = "Debit" | "Kredit";

export type TFinanceTransaction = {
  /** Baris asli Google Sheets, 1-based (data mulai baris 7). */
  rowNumber: number;
  /** Kolom A — NO. */
  no: number;
  /** Kolom B — ISO yyyy-MM-dd, dikonversi dari M/D/YYYY. */
  tanggal: string;
  /** Kolom C — BULAN PELAPORAN. */
  bulanPelaporan: string;
  /** Kolom D — KETERANGAN TRANSAKSI. */
  keterangan: string;
  /** Kolom E — KATEGORI. */
  kategori: string;
  /** Kolom F — ARUS KAS. */
  arusKas: TArusKas;
  /** Kolom G — MATA UANG. */
  mataUang: TMataUang;
  /** Kolom H — NOMINAL TRY, 0 untuk transaksi IDR. */
  nominalTry: number;
  /** Kolom I — NOMINAL IDR, 0 untuk transaksi TRY. */
  nominalIdr: number;
  /** Kolom J — METODE TRANSAKSI. */
  metodeTransaksi: string;
  /** Kolom K — PENANGGUNG JAWAB. */
  penanggungJawab: string;
  /** Kolom L — REKENING PENAMPUNG. */
  rekeningPenampung: string;
  /** Kolom M — PENERIMA. */
  penerima: string;
  /** Kolom N — PENGIRIM. */
  pengirim: string;
  /** Kolom O — TAUTAN DOKUMEN, URL http(s) saja. */
  tautanDokumen: string;
};

export type TFinanceTotals = {
  pemasukanIdr: number;
  pengeluaranIdr: number;
  saldoIdr: number;
  pemasukanTry: number;
  pengeluaranTry: number;
  saldoTry: number;
};

export type TFinanceSnapshot = {
  transactions: TFinanceTransaction[];
  totals: TFinanceTotals;
  /** "fallback" sampai alamat sel KPI DASHBOARD dikirim; "dummy" untuk preview lokal. */
  kpiSource: "fallback" | "dashboard" | "dummy";
  updatedAt: string;
};
