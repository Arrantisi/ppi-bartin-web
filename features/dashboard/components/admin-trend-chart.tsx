import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TDashboardTrendItem } from "@/types/admin-dashboard";
import { formatDateShort } from "@/utils/admin-dashboard";

type TAdminTrendChartProps = {
  items: TDashboardTrendItem[];
};

export function AdminTrendChart({ items }: TAdminTrendChartProps) {
  const max = Math.max(
    1,
    ...items.flatMap((item) => [item.users, item.participants]),
  );

  return (
    <Card data-size="sm">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="content-title">Aktivitas 14 hari</CardTitle>
          <CardDescription className="footnote">
            Anggota baru dan pendaftaran event per hari (UTC)
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="py-12 text-center text-sm text-text-disabled">
            Belum ada aktivitas pada rentang ini.
          </p>
        ) : (
          <>
            <div
              role="img"
              aria-label="Grafik batang anggota baru dan pendaftaran event 14 hari terakhir"
              className="flex h-48 items-end gap-2"
            >
              {items.map((item) => (
                <div
                  key={item.date}
                  className="flex h-full flex-1 flex-col justify-end gap-1"
                  title={`${formatDateShort(item.date)} · ${item.users} anggota · ${item.participants} pendaftar`}
                >
                  <div className="flex h-full items-end gap-0.5">
                    <div
                      className="w-1/2 rounded-t bg-chart-1"
                      style={{ height: `${(item.users / max) * 100}%` }}
                    />
                    <div
                      className="w-1/2 rounded-t bg-chart-2"
                      style={{ height: `${(item.participants / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-center text-[0.625rem] text-text-disabled">
                    {formatDateShort(item.date)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <span className="flex items-center gap-2">
                <span aria-hidden className="size-2 rounded-sm bg-chart-1" />
                Anggota baru
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden className="size-2 rounded-sm bg-chart-2" />
                Pendaftar event
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
