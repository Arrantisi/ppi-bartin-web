"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";

import { AdminEmptyState } from "@/features/dashboard/components/admin-empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TAdminActionQueues } from "@/types/admin-dashboard";
import { formatDateShort } from "@/utils/admin-dashboard";

type TQueueRow = {
  id: string;
  label: string;
  meta: string;
  href?: string;
};

type TQueueSection = {
  key: string;
  title: string;
  description: string;
  rows: TQueueRow[];
  emptyHref?: string;
  emptyCta?: string;
};

type TAdminActionQueueProps = {
  queue: TAdminActionQueues;
};

export function AdminActionQueue({ queue }: TAdminActionQueueProps) {
  const sections: TQueueSection[] = [
    {
      key: "tickets",
      title: "Tiket belum dibaca",
      description: "Pesan masuk yang menunggu respons",
      rows: queue.unreadTickets.map((ticket) => ({
        id: ticket.id,
        label: ticket.subject,
        meta: `${ticket.category} · ${formatDateShort(ticket.createdAt)}`,
        href: `/dashboard/tickets/${ticket.id}`,
      })),
      emptyHref: "/dashboard/tickets",
      emptyCta: "Lihat semua pesan",
    },
    {
      key: "unverified",
      title: "Email belum verifikasi",
      description: "Akun yang menunggu verifikasi lebih dari 7 hari",
      rows: queue.unverifiedUsers.map((user) => ({
        id: user.id,
        label: user.name ?? user.email,
        meta: `${user.email} · ${formatDateShort(user.createdAt)}`,
      })),
    },
    {
      key: "profiles",
      title: "Profil belum lengkap",
      description: "Anggota dengan data wajib kosong",
      rows: queue.incompleteProfiles.map((user) => ({
        id: user.id,
        label: user.name ?? "Tanpa nama",
        meta: `Kurang: ${user.missingFields.join(", ")}`,
      })),
    },
    {
      key: "events",
      title: "Event kuota rendah",
      description: "Pendaftaran dibuka tetapi peserta masih sedikit",
      rows: queue.lowCapacityEvents.map((event) => ({
        id: event.id,
        label: event.title,
        meta: `${event.joined}/${event.capacity} (${event.percent}%) · ${formatDateShort(event.date)}`,
        href: "/dashboard/events",
      })),
      emptyHref: "/dashboard/events",
      emptyCta: "Lihat semua acara",
    },
    {
      key: "news",
      title: "Berita menunggu tayang",
      description: "Konten preview/local yang belum dipublikasikan",
      rows: queue.pendingNews.map((news) => ({
        id: news.id,
        label: news.judul,
        meta: `${news.environment} · ${formatDateShort(news.updatedAt)}`,
        href: "/dashboard/news",
      })),
      emptyHref: "/dashboard/news",
      emptyCta: "Lihat semua berita",
    },
    {
      key: "bans",
      title: "Blokir akan berakhir",
      description: "Akun banned yang masa blokirnya segera habis",
      rows: queue.expiringBans.map((user) => ({
        id: user.id,
        label: user.name ?? "Tanpa nama",
        meta: `Berlaku sampai ${formatDateShort(user.banExpires)}`,
      })),
    },
  ];

  return (
    <section aria-label="Perlu tindakan" className="space-y-4">
      <div className="space-y-1">
        <h2 className="content-title">Perlu Tindakan</h2>
        <p className="footnote">
          Antrean pekerjaan yang bisa ditindaklanjuti dari fitur terkait
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.key} data-size="sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-text-primary">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="footnote">
                    {section.description}
                  </CardDescription>
                </div>
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-xs text-text-secondary">
                  {section.rows.length}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {section.rows.length === 0 ? (
                <AdminEmptyState
                  title="Tidak ada yang perlu ditindaklanjuti"
                  href={section.emptyHref}
                  cta={section.emptyCta}
                />
              ) : (
                <ul className="space-y-2">
                  {section.rows.map((row) => {
                    const content = (
                      <>
                        <span className="min-w-0 flex-1 space-y-0.5">
                          <span className="block truncate text-sm text-text-primary">
                            {row.label}
                          </span>
                          <span className="footnote block truncate">{row.meta}</span>
                        </span>
                        {row.href ? (
                          <IconArrowUpRight
                            aria-hidden
                            className="size-4 shrink-0 text-text-disabled"
                          />
                        ) : null}
                      </>
                    );

                    return (
                      <li key={row.id}>
                        {row.href ? (
                          <Link
                            href={row.href}
                            className="flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2 text-left transition-colors hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                          >
                            {content}
                          </Link>
                        ) : (
                          <div className="flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2">
                            {content}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
