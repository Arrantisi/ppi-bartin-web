import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TAdminCapacityItem } from "@/types/admin-dashboard";
import { formatDateShort } from "@/utils/admin-dashboard";

type TAdminCapacityListProps = {
  items: TAdminCapacityItem[];
};

export function AdminCapacityList({ items }: TAdminCapacityListProps) {
  return (
    <Card data-size="sm">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="content-title">Okupansi event</CardTitle>
          <CardDescription className="footnote">
            Event dengan pendaftaran terbanyak
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-disabled">
            Belum ada event yang dapat ditampilkan.
          </p>
        ) : (
          <ul className="space-y-4">
            {items.map((event) => (
              <li key={event.id} className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate text-sm text-text-primary">{event.title}</p>
                    <p className="footnote">{formatDateShort(event.date)}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-text-secondary">
                    {event.joined}/{event.capacity} · {event.percent}%
                  </span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label={`Kuota ${event.title}: ${event.percent}%`}
                  aria-valuenow={event.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={`h-full rounded-full ${event.percent >= 80 ? "bg-warning" : "bg-primary"}`}
                    style={{ width: `${event.percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
