import { HomeLayoutComponent } from "@/components/layout/home-layout";
import { env } from "@/lib/env";

import { FinanceDashboard } from "./components/finance-dashboard";

const FinancePage = () => {
  return (
    <HomeLayoutComponent>
      <FinanceDashboard sheetUrl={env.NEXT_PUBLIC_FINANCE_SHEET_URL} />
    </HomeLayoutComponent>
  );
};

export default FinancePage;
