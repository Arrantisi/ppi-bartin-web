import { AdminManagementShell } from "@/features/dashboard/components/admin-management-shell";
import { AdminUsersTable } from "@/features/dashboard/components/admin-users-table";
import { getAdminUsers } from "@/server/data/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardUsersPage() {
  const users = await getAdminUsers();

  return (
    <AdminManagementShell
      title="Kelola Pengguna"
      description="Ubah role, blokir, atau hapus akun anggota."
    >
      <AdminUsersTable rows={users} />
    </AdminManagementShell>
  );
}
