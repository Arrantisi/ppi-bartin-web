import { AdminFinancePage } from "@/features/dashboard/components/admin-finance-page";
import { AdminManagementShell } from "@/features/dashboard/components/admin-management-shell";

export default function DashboardFinancePage() {
  return (
    <AdminManagementShell
      title="Keuangan"
      description="Ringkasan dan transaksi dari Google Sheets."
    >
      <AdminFinancePage />
    </AdminManagementShell>
  );
}
