import { FinanceDashboard } from "@/features/finance/components/finance-dashboard";
import { env } from "@/lib/env";

export function AdminFinancePage() {
  return <FinanceDashboard sheetUrl={env.NEXT_PUBLIC_FINANCE_SHEET_URL} />;
}
