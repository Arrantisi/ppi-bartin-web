import { cache } from "react";

import { env } from "@/lib/env";
import { getFinanceValues } from "@/lib/google-sheets";
import { studentAccount } from "@/server/actions/account";
import { getDummyFinanceSnapshot } from "@/server/data/finance-dummy";
import type { TFinanceSnapshot } from "@/types/finance";
import {
  computeFinanceTotals,
  parseFinanceRows,
} from "@/utils/finance-parser";

/**
 * Satu snapshot keuangan dari Google Sheets.
 * `cache` mencegah batchGet duplikat bila dipanggil beberapa kali dalam satu request.
 */
export const getFinanceSnapshot = cache(async (): Promise<TFinanceSnapshot> => {
  await studentAccount();

  // Preview lokal: tidak memanggil Google API sama sekali.
  if (env.FINANCE_USE_DUMMY_DATA === "true") {
    return getDummyFinanceSnapshot();
  }

  const { transactions: rawTransactions } = await getFinanceValues();
  const transactions = parseFinanceRows(rawTransactions);

  return {
    transactions,
    totals: computeFinanceTotals(transactions),
    kpiSource: "fallback",
    updatedAt: new Date().toISOString(),
  };
});
