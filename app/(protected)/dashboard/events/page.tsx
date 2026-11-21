import { AdminEventsTable } from "@/features/dashboard/components/admin-events-table";
import { AdminManagementShell } from "@/features/dashboard/components/admin-management-shell";
import { getAdminEvents } from "@/server/data/admin-dashboard";
import { firstSearchParam, parseAdminPage } from "@/utils/admin-dashboard";

export const dynamic = "force-dynamic";

type TSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default async function DashboardEventsPage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const params = await searchParams;
  const query = firstSearchParam(params.q);
  const environment = firstSearchParam(params.environment) || "ALL";
  const page = await getAdminEvents(
    parseAdminPage(firstSearchParam(params.page)),
    query,
    environment,
  );

  return (
    <AdminManagementShell
      title="Kelola Acara"
      description="Atur status tayang, unduh peserta, atau hapus acara."
    >
      <AdminEventsTable
        page={page}
        query={query}
        environment={environment}
      />
    </AdminManagementShell>
  );
}
