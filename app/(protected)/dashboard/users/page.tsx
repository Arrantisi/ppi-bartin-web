import { AdminManagementShell } from "@/features/dashboard/components/admin-management-shell";
import { AdminUsersTable } from "@/features/dashboard/components/admin-users-table";
import { studentAccount } from "@/server/actions/account";
import { getAdminUsers } from "@/server/data/admin-dashboard";
import { firstSearchParam, parseAdminPage } from "@/utils/admin-dashboard";

export const dynamic = "force-dynamic";

type TSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default async function DashboardUsersPage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const params = await searchParams;
  const page = await getAdminUsers(
    parseAdminPage(firstSearchParam(params.page)),
    firstSearchParam(params.q),
    firstSearchParam(params.role) || "ALL",
  );
  const session = await studentAccount();

  return (
    <AdminManagementShell
      title="Kelola Pengguna"
      description="Ubah role, blokir, atau hapus akun anggota."
    >
      <AdminUsersTable
        page={page}
        query={firstSearchParam(params.q)}
        role={firstSearchParam(params.role) || "ALL"}
        currentUserId={session.user.id}
      />
    </AdminManagementShell>
  );
}
