"use client";

import {
  IconCalendarEvent,
  IconFileText,
  IconNews,
  IconSettings,
  IconTicket,
  IconUsers,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TAction = {
  label: string;
  href: string;
  icon: ReactNode;
};

const ACTIONS: TAction[] = [
  {
    label: "Kelola pengguna",
    href: "/dashboard/users",
    icon: <IconUsers className="size-4" aria-hidden />,
  },
  {
    label: "Pesan masuk",
    href: "/dashboard/tickets",
    icon: <IconTicket className="size-4" aria-hidden />,
  },
  {
    label: "Buat acara",
    href: "/dashboard/acara/create",
    icon: <IconCalendarEvent className="size-4" aria-hidden />,
  },
  {
    label: "Kelola acara",
    href: "/dashboard/events",
    icon: <IconCalendarEvent className="size-4" aria-hidden />,
  },
  {
    label: "Buat berita",
    href: "/dashboard/berita/create",
    icon: <IconFileText className="size-4" aria-hidden />,
  },
  {
    label: "Kelola berita",
    href: "/dashboard/news",
    icon: <IconNews className="size-4" aria-hidden />,
  },
  {
    label: "Pengaturan",
    href: "/dashboard/settings",
    icon: <IconSettings className="size-4" aria-hidden />,
  },
];

export function AdminQuickActions() {
  return (
    <Card data-size="sm">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="content-title">Akses cepat</CardTitle>
          <CardDescription className="footnote">
            Pintasan ke halaman manajemen admin
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {ACTIONS.map((action) => (
          <Button
            key={action.label}
            render={<Link href={action.href} />}
            variant="outline"
            className="h-auto justify-start px-3 py-2.5"
          >
            {action.icon}
            <span className="truncate">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
