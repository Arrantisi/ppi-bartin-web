import { redirect } from "next/navigation";

import { AdminActionQueue } from "@/features/dashboard/components/admin-action-queue";
import { AdminCapacityList } from "@/features/dashboard/components/admin-capacity-list";
import { AdminDistributionChart } from "@/features/dashboard/components/admin-distribution-chart";
import { AdminKpiGrid, AdminSystemStrip } from "@/features/dashboard/components/admin-kpi-grid";
import { AdminQuickActions } from "@/features/dashboard/components/admin-quick-actions";
import { AdminTrendChart } from "@/features/dashboard/components/admin-trend-chart";
import { getCurrentUserRole } from "@/server/actions/account";
import { getAdminDashboardSnapshot } from "@/server/data/admin-dashboard";
import type { TAdminDashboardAccessScope } from "@/types/admin-dashboard";
import { formatDateShort } from "@/utils/admin-dashboard";

const ADMIN_ROLES = new Set(["ADMIN"]);

const scopeLabels: Record<TAdminDashboardAccessScope, string> = {
  all: "Semua environment",
  preview: "Preview + production",
  production: "Production",
};

export async function AdminDashboardPage() {
  const role = await getCurrentUserRole();
  if (!ADMIN_ROLES.has(role)) redirect("/home");

  const snapshot = await getAdminDashboardSnapshot();

  return (
    <div className="flex flex-col space-y-6 pb-24">
      <header className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="subheadline">Ringkasan</p>
          <h1 className="text-3xl font-semibold text-text-primary">
            Dashboard Admin
          </h1>
          <p className="body text-text-secondary">
            Pantau anggota, acara, berita, dan pesan masuk dari satu tempat.
          </p>
        </div>
        <div className="w-fit space-y-1 rounded-xl border border-border bg-card px-4 py-2 text-right">
          <p className="footnote">Diperbarui {formatDateShort(snapshot.generatedAt)}</p>
          <p className="text-xs text-text-secondary">
            {scopeLabels[snapshot.accessScope]}
          </p>
        </div>
      </header>

      <AdminKpiGrid kpis={snapshot.kpis} />
      <AdminSystemStrip kpis={snapshot.kpis} />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminTrendChart items={snapshot.trends} />
        </div>
        <AdminQuickActions />
      </div>

      <AdminActionQueue queue={snapshot.actionQueue} />

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminDistributionChart distributions={snapshot.distributions} />
        <AdminCapacityList items={snapshot.capacity} />
      </div>
    </div>
  );
}
