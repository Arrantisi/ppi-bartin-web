export type TMataUang = "TRY" | "IDR";

export type TArusKas = "Debit" | "Kredit";

export type TFinanceTransaction = {
  /** Baris asli Google Sheets, 1-based (data mulai baris 8). */
  rowNumber: number;
  /** Kolom B — NO, hasil rumus `=sequence(250)` di sheet bendahara. */
  no: number;
  /** Kolom C — ISO yyyy-MM-dd, dikonversi dari M/D/YYYY. */
  tanggal: string;
  /** Kolom D — BULAN PELAPORAN. */
  bulanPelaporan: string;
  /** Kolom E — KETERANGAN TRANSAKSI. */
  keterangan: string;
  /** Kolom F — KATEGORI. */
  kategori: string;
  /** Kolom G — ARUS KAS. */
  arusKas: TArusKas;
  /** Kolom H — MATA UANG. */
  mataUang: TMataUang;
  /** Kolom I — NOMINAL TRY, 0 untuk transaksi IDR. */
  nominalTry: number;
  /** Kolom J — NOMINAL IDR, 0 untuk transaksi TRY. */
  nominalIdr: number;
  /** Kolom K — METODE TRANSAKSI. */
  metodeTransaksi: string;
  /** Kolom L — PENANGGUNG JAWAB. */
  penanggungJawab: string;
  /** Kolom M — REKENING PENAMPUNG. */
  rekeningPenampung: string;
  /** Kolom N — PENERIMA. */
  penerima: string;
  /** Kolom O — PENGIRIM. */
  pengirim: string;
  /** Kolom P — TAUTAN NOTA/RESI, URL http(s) saja. */
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

/** Saldo dana pada blok A `DASHBOARD` (sel E/J/S baris 8–12). */
export type TFinanceFund = {
  key: "lembaga" | "darurat" | "abadi";
  label: string;
  marker: string;
  idr: number;
  try: number;
};

/** Satu baris tabel `LAPORAN PENYERAPAN ANGGARAN` (baris 30+ di sheet). */
export type TBudgetRealization = {
  no: number;
  lembaga: string;
  unit: string;
  pagu: number;
  realisasi: number;
  sisa: number;
};

export type TFinanceLegend = {
  marker: string;
  description: string;
};

/**
 * Ringkasan yang dibaca langsung dari tab `DASHBOARD` bendahara.
 * `totals` di sini berasal dari sel rumus sheet, bukan hitungan buku besar.
 */
export type TFinanceDashboardReport = {
  title: string;
  department: string;
  period: string;
  funds: TFinanceFund[];
  legend: TFinanceLegend[];
  totals: TFinanceTotals;
  budget: TBudgetRealization[];
};

/** Satu kolom bulan FEB–JAN pada tab WAJIB KAS. */
export type TWajibKasMonth = {
  label: string;
  paid: boolean;
};

/** Satu baris anggota pada tab WAJIB KAS. */
export type TWajibKasMember = {
  no: number;
  angkatan: number;
  nama: string;
  months: TWajibKasMonth[];
  tunggakan: number;
  status: "lunas" | "tunggakan";
};

/** Satu blok angkatan (kiri B:R atau kanan T:AJ) pada tab WAJIB KAS. */
export type TWajibKasBlock = {
  penanggungJawab: string;
  members: TWajibKasMember[];
};

export type TWajibKasReport = {
  title: string;
  department: string;
  period: string;
  blocks: TWajibKasBlock[];
  summary: {
    total: number;
    lunas: number;
    tunggakan: number;
  };
};

export type TFinanceSnapshot = {
  transactions: TFinanceTransaction[];
  totals: TFinanceTotals;
  /** Ringkasan dari tab DASHBOARD; null ketika parser tidak menemukan data. */
  report: TFinanceDashboardReport | null;
  /** Data kas anggota dari tab WAJIB KAS; null bila sheet kosong. */
  wajibKas: TWajibKasReport | null;
  /** "buku-besar" = KPI dihitung dari transaksi; "dummy" = pratinjau data contoh. */
  kpiSource: "buku-besar" | "dummy";
  updatedAt: string;
};
