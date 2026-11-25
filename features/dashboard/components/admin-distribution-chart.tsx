import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TDashboardDistributionItem } from "@/types/admin-dashboard";

type TSection = {
  title: string;
  items: TDashboardDistributionItem[];
  color: string;
};

type TAdminDistributionChartProps = {
  distributions: {
    roles: TDashboardDistributionItem[];
    angkatan: TDashboardDistributionItem[];
    fakultas: TDashboardDistributionItem[];
    genders: TDashboardDistributionItem[];
    ticketStatus: TDashboardDistributionItem[];
  };
};

export function AdminDistributionChart({
  distributions,
}: TAdminDistributionChartProps) {
  const sections: TSection[] = [
    { title: "Role anggota", items: distributions.roles, color: "bg-chart-1" },
    { title: "Angkatan", items: distributions.angkatan, color: "bg-chart-2" },
    { title: "Fakultas", items: distributions.fakultas, color: "bg-chart-3" },
    { title: "Jenis kelamin", items: distributions.genders, color: "bg-chart-4" },
    { title: "Status tiket", items: distributions.ticketStatus, color: "bg-chart-5" },
  ];

  return (
    <Card data-size="sm">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="content-title">Komposisi anggota</CardTitle>
          <CardDescription className="footnote">
            Distribusi data teratas dari database
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        {sections.map((section) => {
          const max = Math.max(1, ...section.items.map((item) => item.value));
          return (
            <section key={section.title} aria-label={section.title} className="space-y-3">
              <h3 className="subheadline">{section.title}</h3>
              {section.items.length === 0 ? (
                <p className="text-sm text-text-disabled">Belum ada data.</p>
              ) : (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-xs text-text-secondary">
                        <span className="truncate">{item.label}</span>
                        <span className="font-mono text-text-primary">{item.value}</span>
                      </div>
                      <div
                        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-label={`${item.label}: ${item.value}`}
                        aria-valuenow={item.value}
                        aria-valuemin={0}
                        aria-valuemax={max}
                      >
                        <div
                          className={`h-full rounded-full ${section.color}`}
                          style={{ width: `${(item.value / max) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </CardContent>
    </Card>
  );
}
