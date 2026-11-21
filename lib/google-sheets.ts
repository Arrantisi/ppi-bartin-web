import { google } from "googleapis";

import { env } from "@/lib/env";

const FINANCE_TAB = "BUKU BESAR KEUANGAN";
const DASHBOARD_TAB = "DASHBOARD";

export const FINANCE_SHEET_RANGE = `'${FINANCE_TAB}'!A7:O`;
const DASHBOARD_SHEET_RANGE = `'${DASHBOARD_TAB}'!A1:Z80`;

type TGoogleCredentials = {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
};

export type TFinanceSheetValues = {
  transactions: unknown[][];
  dashboard: unknown[][];
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
  `'${FINANCE_TAB}'!A${rowNumber}:O${rowNumber}`;

/** Membaca transaksi dan ringkasan sekaligus untuk menghemat kuota API. */
export async function getFinanceValues(): Promise<TFinanceSheetValues> {
  const { spreadsheetId } = getCredentials();

  const response = await getSheets().spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: [FINANCE_SHEET_RANGE, DASHBOARD_SHEET_RANGE],
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });

  const valueRanges = response.data.valueRanges ?? [];

  return {
    transactions: (valueRanges[0]?.values ?? []) as unknown[][],
    dashboard: (valueRanges[1]?.values ?? []) as unknown[][],
  };
}

/** Append ke A7:O dan mengembalikan nomor baris yang benar-benar dibuat Sheets. */
export async function appendFinanceRow(row: string[]): Promise<number> {
  const { spreadsheetId } = getCredentials();

  const response = await getSheets().spreadsheets.values.append({
    spreadsheetId,
    range: FINANCE_SHEET_RANGE,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });

  const updatedRange = response.data.updates?.updatedRange;
  const match = updatedRange?.match(/!A(\d+):O(\d+)$/);
  if (!match) {
    throw new Error("Google Sheets tidak mengembalikan nomor baris baru.");
  }

  return Number(match[1]);
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
