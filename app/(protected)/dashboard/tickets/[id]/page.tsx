import { AdminTicketDetail } from "@/features/customer-service/components/admin-ticket-detail";
import { AdminManagementShell } from "@/features/dashboard/components/admin-management-shell";

type TDashboardTicketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardTicketDetailPage({
  params,
}: TDashboardTicketDetailPageProps) {
  const { id } = await params;

  return (
    <AdminManagementShell
      title="Detail Pesan"
      description="Lihat lampiran dan perbarui status tiket."
    >
      <div className="max-w-3xl">
        <AdminTicketDetail ticketId={id} basePath="/dashboard/tickets" />
      </div>
    </AdminManagementShell>
  );
}
