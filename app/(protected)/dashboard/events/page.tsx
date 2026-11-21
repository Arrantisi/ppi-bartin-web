import { AdminEventsTable } from "@/features/dashboard/components/admin-events-table";
import { AdminManagementShell } from "@/features/dashboard/components/admin-management-shell";
import { getAdminEvents } from "@/server/data/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardEventsPage() {
  const events = await getAdminEvents();

  return (
    <AdminManagementShell
      title="Kelola Acara"
      description="Atur status tayang, unduh peserta, atau hapus acara."
    >
      <AdminEventsTable rows={events} />
    </AdminManagementShell>
  );
}
