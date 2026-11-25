import { AdminManagementShell } from "@/features/dashboard/components/admin-management-shell";
import { AdminTicketsPage } from "@/features/dashboard/components/admin-tickets-page";

export default function DashboardTicketsPage() {
  return (
    <AdminManagementShell
      title="Pesan Masuk"
      description="Kelola pesan dan keluhan dari anggota."
    >
      <AdminTicketsPage />
    </AdminManagementShell>
  );
}
