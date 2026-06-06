"use client";

import { useCustomerServiceTickets } from "@/hooks/use-customer-service";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import {
  IconMessage,
  IconChevronRight,
  IconAlertCircle,
  IconCircleCheck,
  IconEye,
} from "@tabler/icons-react";
import { imageUrl } from "@/utils/image-url";

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  PENDING: {
    label: "Pending",
    icon: <IconAlertCircle className="size-3.5" />,
    className: "bg-warning-subtle text-warning border-warning/20",
  },
  READ: {
    label: "Dibaca",
    icon: <IconEye className="size-3.5" />,
    className: "bg-info-subtle text-info border-info/20",
  },
  RESOLVED: {
    label: "Selesai",
    icon: <IconCircleCheck className="size-3.5" />,
    className: "bg-success-subtle text-success border-success/20",
  },
};

const levelBadge: Record<string, { label: string; className: string }> = {
  rendah: { label: "Rendah", className: "text-text-disabled border-border" },
  sedang: { label: "Sedang", className: "text-warning border-warning/30" },
  darurat: { label: "Darurat", className: "text-destructive border-destructive/30" },
};

const UserAvatar = ({ user }: { user: { name?: string | null; username?: string | null; image?: string | null } }) => {
  const initial = (user.name || user.username || "?").charAt(0).toUpperCase();

  if (user.image) {
    const src = user.image.startsWith("http") ? user.image : imageUrl(user.image);
    return (
      <div className="size-10 rounded-full overflow-hidden shrink-0 border border-border">
        <Image src={src} alt="" width={40} height={40} className="object-cover size-full" />
      </div>
    );
  }

  return (
    <div className="size-10 rounded-full bg-surface-hover flex items-center justify-center shrink-0">
      <span className="text-sm font-medium text-text-secondary">{initial}</span>
    </div>
  );
};

export const AdminTicketList = () => {
  const { data, isLoading } = useCustomerServiceTickets();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4 border border-border rounded-xl">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const tickets = data?.data ?? [];

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <IconMessage className="size-12 text-text-disabled mb-4" />
        <p className="text-text-secondary text-sm">Belum ada pesan customer service</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tickets.map((ticket) => {
        const status = statusConfig[ticket.status] ?? statusConfig.PENDING;
        const level = levelBadge[ticket.level] ?? levelBadge.rendah;

        return (
          <button
            key={ticket.id}
            type="button"
            onClick={() => router.push(`/home/profile/customer-service/list/${ticket.id}`)}
            className="w-full text-left flex items-center gap-3 p-4 border border-border rounded-xl hover:bg-surface-hover transition-colors"
          >
            <UserAvatar user={ticket.user} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-text-primary truncate">
                  {ticket.subject}
                </span>
                <span className={level.className + " text-[0.625rem] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded border shrink-0"}>
                  {level.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-disabled">
                <span>{ticket.user.name || ticket.user.username || "Unknown"}</span>
                <span>·</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                {ticket.files && ticket.files.length > 0 && (
                  <>
                    <span>·</span>
                    <span>{ticket.files.length} foto</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className={"inline-flex items-center gap-1 text-[0.625rem] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full border " + status.className}>
                {status.icon}
                {status.label}
              </div>
              <IconChevronRight className="size-4 text-text-disabled" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
