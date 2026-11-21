import { AdminManagementShell } from "@/features/dashboard/components/admin-management-shell";
import { AdminNewsTable } from "@/features/dashboard/components/admin-news-table";
import { getAdminNews } from "@/server/data/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardNewsPage() {
  const news = await getAdminNews();

  return (
    <AdminManagementShell
      title="Kelola Berita"
      description="Publikasikan, sembunyikan, atau hapus berita."
    >
      <AdminNewsTable rows={news} />
    </AdminManagementShell>
  );
}
