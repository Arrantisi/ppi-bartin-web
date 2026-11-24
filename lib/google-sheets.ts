import { google } from "googleapis";

import { env } from "@/lib/env";
import { findNextFinanceRow } from "@/utils/finance-parser";

const FINANCE_TAB = "BUKU BESAR KEUANGAN";
const DASHBOARD_TAB = "DASHBOARD";
const WAJIB_KAS_TAB = "WAJIB KAS";

/**
 * Sheet bendahara: kolom A = spacer, kolom B = NO dari rumus `=sequence(250)`,
 * header baris 6–7, data mulai baris 8, dan tautan dokumen ada di kolom P.
 */
const FINANCE_DATA_START_ROW = 8;
export const FINANCE_SHEET_RANGE = `'${FINANCE_TAB}'!B${FINANCE_DATA_START_ROW}:P`;
const DASHBOARD_SHEET_RANGE = `'${DASHBOARD_TAB}'!A1:Z80`;
/**
 * Tab `WAJIB KAS` memuat dua lajur blok berdampingan (B:R dan T:AJ).
 * Sheet saat ini 122 baris; 140 memberi ruang tanpa menambah kuota API.
 */
const WAJIB_KAS_SHEET_RANGE = `'${WAJIB_KAS_TAB}'!A1:AK140`;

type TGoogleCredentials = {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
};

export type TFinanceSheetValues = {
  transactions: unknown[][];
  dashboard: unknown[][];
  wajibKas: unknown[][];
};

const getCredentials = (): TGoogleCredentials => {
  const spreadsheetId = env.GOOGLE_SHEET_ID;
  const clientEmail = env.GOOGLE_CLIENT_EMAIL;
  const privateKey = env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error(
      "Google Sheets belum dikonfigurasi. Lengkapi GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL, dan GOOGLE_PRIVATE_KEY.",
    );
  }

  return {
    spreadsheetId,
    clientEmail,
    // .env sering menyimpan newline sebagai literal "\\n".
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
};

const createAuth = () => {
  const { clientEmail, privateKey } = getCredentials();
  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
};

let authClient: ReturnType<typeof createAuth> | null = null;

const getAuth = () => {
  if (!authClient) authClient = createAuth();
  return authClient;
};

const getSheets = () => {
  getCredentials();
  return google.sheets({ version: "v4", auth: getAuth() });
};

const rowRange = (rowNumber: number) =>
  `'${FINANCE_TAB}'!C${rowNumber}:P${rowNumber}`;

/** Membaca transaksi dan ringkasan sekaligus untuk menghemat kuota API. */
export async function getFinanceValues(): Promise<TFinanceSheetValues> {
  const { spreadsheetId } = getCredentials();

  const response = await getSheets().spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: [
      FINANCE_SHEET_RANGE,
      DASHBOARD_SHEET_RANGE,
      WAJIB_KAS_SHEET_RANGE,
    ],
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });

  const valueRanges = response.data.valueRanges ?? [];

  return {
    transactions: (valueRanges[0]?.values ?? []) as unknown[][],
    dashboard: (valueRanges[1]?.values ?? []) as unknown[][],
    wajibKas: (valueRanges[2]?.values ?? []) as unknown[][],
  };
}

/**
 * Menulis ke baris kosong pertama di C:P.
 * `values.append` sengaja tidak dipakai: kolom B berisi `=sequence(250)`, sehingga
 * Sheets mengira tabel sampai baris ~257 dan memindahkan penulisan ke kolom B.
 */
export async function appendFinanceRow(row: string[]): Promise<number> {
  const { spreadsheetId } = getCredentials();
  const sheets = getSheets();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${FINANCE_TAB}'!C${FINANCE_DATA_START_ROW}:P`,
    valueRenderOption: "FORMATTED_VALUE",
  });

  const rowNumber = findNextFinanceRow(
    response.data.values ?? [],
    FINANCE_DATA_START_ROW,
  );
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: rowRange(rowNumber),
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  return rowNumber;
}

export async function updateFinanceRow(
  rowNumber: number,
  row: string[],
): Promise<void> {
  const { spreadsheetId } = getCredentials();

  await getSheets().spreadsheets.values.update({
    spreadsheetId,
    range: rowRange(rowNumber),
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

/** Mengosongkan nilai baris tanpa menghapus baris fisik. */
export async function clearFinanceRow(rowNumber: number): Promise<void> {
  const { spreadsheetId } = getCredentials();

  await getSheets().spreadsheets.values.clear({
    spreadsheetId,
    range: rowRange(rowNumber),
  });
}
