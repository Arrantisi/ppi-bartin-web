import type { ReactNode } from "react";
import {
  IconBan,
  IconBell,
  IconCalendarEvent,
  IconChartBar,
  IconCircleCheck,
  IconClock,
  IconFileText,
  IconNews,
  IconShield,
  IconTicket,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TAdminKpis } from "@/types/admin-dashboard";
import { formatCompactNumber, formatDurationHours } from "@/utils/admin-dashboard";

type TTone = "neutral" | "success" | "warning" | "danger" | "info";

/** Chip ikon diberi tint tipis supaya kartu tidak monoton, tetap pakai token. */
const chipStyles: Record<TTone, string> = {
  neutral: "bg-surface-hover text-text-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
};

type TKpi = {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  tone: TTone;
};

const buildKpis = (kpis: TAdminKpis): TKpi[] => [
  {
    label: "Anggota terverifikasi",
    value: formatCompactNumber(kpis.verifiedUsers),
    hint: `dari ${formatCompactNumber(kpis.totalUsers)} total anggota`,
    icon: <IconUsers className="size-5" aria-hidden />,
    tone: "success",
  },
  {
    label: "Anggota baru",
    value: formatCompactNumber(kpis.newUsers30d),
    hint: "30 hari terakhir",
    icon: <IconUserPlus className="size-5" aria-hidden />,
    tone: "info",
  },
  {
    label: "Profil lengkap",
    value: `${100 - kpis.incompleteProfilePercent}%`,
    hint: `${kpis.incompleteProfilePercent}% perlu dilengkapi`,
    icon: <IconCircleCheck className="size-5" aria-hidden />,
    tone: kpis.incompleteProfilePercent > 25 ? "warning" : "success",
  },
  {
    label: "Event aktif",
    value: formatCompactNumber(kpis.activeEvents),
    hint: "tanggal belum terlewati",
    icon: <IconCalendarEvent className="size-5" aria-hidden />,
    tone: "info",
  },
  {
    label: "Pendaftaran dibuka",
    value: formatCompactNumber(kpis.upcomingEvents),
    hint: "batas daftar masih berlaku",
    icon: <IconChartBar className="size-5" aria-hidden />,
    tone: "neutral",
  },
  {
    label: "Total peserta",
    value: formatCompactNumber(kpis.totalParticipants),
    hint: "pendaftaran seluruh event",
    icon: <IconUsers className="size-5" aria-hidden />,
    tone: "neutral",
  },
  {
    label: "Pembatalan",
    value: `${kpis.cancellationRate}%`,
    hint: "dari total pendaftaran",
    icon: <IconBan className="size-5" aria-hidden />,
    tone: kpis.cancellationRate > 10 ? "warning" : "neutral",
  },
  {
    label: "Berita tayang",
    value: formatCompactNumber(kpis.publishedNews),
    hint: "environment production",
    icon: <IconNews className="size-5" aria-hidden />,
    tone: "success",
  },
  {
    label: "Berita menunggu",
    value: formatCompactNumber(kpis.previewNews),
    hint: "preview / local",
    icon: <IconFileText className="size-5" aria-hidden />,
    tone: kpis.previewNews > 0 ? "warning" : "neutral",
  },
  {
    label: "Tiket open",
    value: formatCompactNumber(kpis.openTickets),
    hint: "belum berstatus selesai",
    icon: <IconTicket className="size-5" aria-hidden />,
    tone: kpis.openTickets > 0 ? "warning" : "success",
  },
  {
    label: "Tiket belum dibaca",
    value: formatCompactNumber(kpis.unreadTickets),
    hint: "menunggu respons admin",
    icon: <IconShield className="size-5" aria-hidden />,
    tone: kpis.unreadTickets > 0 ? "danger" : "success",
  },
  {
    label: "Rata-rata selesai",
    value: formatDurationHours(kpis.avgTicketResolutionHours),
    hint: "sejak tiket dibuat",
    icon: <IconClock className="size-5" aria-hidden />,
    tone: "neutral",
  },
];

type TAdminKpiGridProps = {
  kpis: TAdminKpis;
};

export function AdminKpiGrid({ kpis }: TAdminKpiGridProps) {
  return (
    <section aria-label="Ringkasan admin" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {buildKpis(kpis).map((kpi) => (
        <Card key={kpi.label} data-size="sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
            <div className="space-y-1">
              <CardTitle className="subheadline">{kpi.label}</CardTitle>
              <CardDescription className="footnote">{kpi.hint}</CardDescription>
            </div>
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl",
                chipStyles[kpi.tone],
              )}
            >
              {kpi.icon}
            </span>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xl font-semibold text-text-primary">
              {kpi.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

type TAdminSystemStripProps = {
  kpis: TAdminKpis;
};

export function AdminSystemStrip({ kpis }: TAdminSystemStripProps) {
  const items = [
    {
      label: "Subscriber push",
      value: formatCompactNumber(kpis.pushSubscribers),
      icon: <IconBell className="size-4" aria-hidden />,
      tone: "info" as TTone,
    },
    {
      label: "Sesi aktif",
      value: formatCompactNumber(kpis.activeSessions),
      icon: <IconUsers className="size-4" aria-hidden />,
      tone: "success" as TTone,
    },
    {
      label: "Akun diblokir",
      value: formatCompactNumber(kpis.bannedUsers),
      icon: <IconBan className="size-4" aria-hidden />,
      tone: "danger" as TTone,
    },
  ];

  return (
    <section
      aria-label="Status sistem"
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
        >
          <span className="flex items-center gap-2 text-sm text-text-secondary">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-lg",
                chipStyles[item.tone],
              )}
            >
              {item.icon}
            </span>
            {item.label}
          </span>
          <span className="font-mono text-sm font-semibold text-text-primary">
            {item.value}
          </span>
        </div>
      ))}
    </section>
  );
}
