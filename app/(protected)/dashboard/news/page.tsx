import { AdminManagementShell } from "@/features/dashboard/components/admin-management-shell";
import { AdminNewsTable } from "@/features/dashboard/components/admin-news-table";
import { getAdminNews } from "@/server/data/admin-dashboard";
import { firstSearchParam, parseAdminPage } from "@/utils/admin-dashboard";

export const dynamic = "force-dynamic";

type TSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default async function DashboardNewsPage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const params = await searchParams;
  const query = firstSearchParam(params.q);
  const environment = firstSearchParam(params.environment) || "ALL";
  const page = await getAdminNews(
    parseAdminPage(firstSearchParam(params.page)),
    query,
    environment,
  );

  return (
    <AdminManagementShell
      title="Kelola Berita"
      description="Publikasikan, sembunyikan, atau hapus berita."
    >
      <AdminNewsTable
        page={page}
        query={query}
        environment={environment}
      />
    </AdminManagementShell>
  );
}
