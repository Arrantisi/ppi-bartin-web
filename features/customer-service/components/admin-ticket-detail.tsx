"use client";

import { useCustomerServiceTickets, useUpdateTicketStatus } from "@/hooks/use-customer-service";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import {
  IconArrowNarrowLeft,
  IconAlertCircle,
  IconCircleCheck,
  IconEye,
  IconTag,
  IconChartDots3,
  IconUser,
  IconCalendar,
  IconMessage,
  IconPhoto,
} from "@tabler/icons-react";
import { toast } from "sonner";

const statusMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  PENDING: { label: "Pending", icon: <IconAlertCircle className="size-4" /> },
  READ: { label: "Dibaca", icon: <IconEye className="size-4" /> },
  RESOLVED: { label: "Selesai", icon: <IconCircleCheck className="size-4" /> },
};

const levelLabel: Record<string, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  darurat: "Darurat",
};

const catagoryLabel: Record<string, string> = {
  dokumen: "Ikamet & Legalitas",
  akademik: "Masalah Kampus/TÖMER",
  akomodasi: "Masalah Asrama/Ev",
  teknis: "Error Web/Aplikasi",
  finansial: "Dana & Beasiswa",
  saran: "Kritik & Saran",
};

export const AdminTicketDetail = ({ ticketId }: { ticketId: string }) => {
  const { data, isLoading } = useCustomerServiceTickets();
  const updateStatus = useUpdateTicketStatus();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const ticket = data?.data?.find((t) => t.id === ticketId);
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <IconMessage className="size-12 text-text-disabled mb-4" />
        <p className="text-text-secondary text-sm">Tiket tidak ditemukan</p>
        <Button variant="ghost" onClick={() => router.push("/home/profile/customer-service/list")} className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }

  const status = statusMeta[ticket.status] ?? statusMeta.PENDING;

  const handleStatusUpdate = async (newStatus: string) => {
    const res = await updateStatus.mutateAsync({ id: ticket.id, status: newStatus });
    if (res.status === "success") {
      toast.success(res.msg);
    } else {
      toast.error(res.msg);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push("/home/profile/customer-service/list")}
        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <IconArrowNarrowLeft className="size-4" />
        Kembali
      </button>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-text-primary mb-2">
                {ticket.subject}
              </h1>
              <div className="flex items-center gap-2 text-xs text-text-disabled">
                <span className={"inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[0.625rem] uppercase tracking-wider font-medium " + (
                  ticket.status === "RESOLVED" ? "bg-success-subtle text-success border-success/20" :
                  ticket.status === "READ" ? "bg-info-subtle text-info border-info/20" :
                  "bg-warning-subtle text-warning border-warning/20"
                )}>
                  {status.icon}
                  {status.label}
                </span>
                <span className={"inline-flex items-center px-2 py-0.5 rounded-full border text-[0.625rem] uppercase tracking-wider font-medium " + (
                  ticket.level === "darurat" ? "text-destructive border-destructive/30" :
                  ticket.level === "sedang" ? "text-warning border-warning/30" :
                  "text-text-disabled border-border"
                )}>
                  {levelLabel[ticket.level] ?? ticket.level}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-surface-hover flex items-center justify-center shrink-0">
                <IconTag className="size-4 text-text-secondary" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.625rem] uppercase tracking-wider text-text-disabled font-medium">Kategori</p>
                <p className="text-sm text-text-primary">{catagoryLabel[ticket.catagory] ?? ticket.catagory}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-surface-hover flex items-center justify-center shrink-0">
                <IconChartDots3 className="size-4 text-text-secondary" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.625rem] uppercase tracking-wider text-text-disabled font-medium">Level</p>
                <p className="text-sm text-text-primary">{levelLabel[ticket.level] ?? ticket.level}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-surface-hover flex items-center justify-center shrink-0">
                <IconUser className="size-4 text-text-secondary" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.625rem] uppercase tracking-wider text-text-disabled font-medium">Pengirim</p>
                <p className="text-sm text-text-primary truncate">
                  {ticket.user.name || ticket.user.username || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-surface-hover flex items-center justify-center shrink-0">
                <IconCalendar className="size-4 text-text-secondary" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.625rem] uppercase tracking-wider text-text-disabled font-medium">Tanggal</p>
                <p className="text-sm text-text-primary">
                  {new Date(ticket.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-[0.625rem] uppercase tracking-wider text-text-disabled font-medium mb-3">Pesan</p>
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {ticket.message}
            </p>
          </div>

          {ticket.files && ticket.files.length > 0 && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <IconPhoto className="size-4 text-text-secondary" />
                <p className="text-[0.625rem] uppercase tracking-wider text-text-disabled font-medium">
                  Lampiran ({ticket.files.length} foto)
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {ticket.files.map((file) => (
                  <a
                    key={file.id}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden border border-border bg-surface group relative"
                  >
                    <Image
                      src={file.fileUrl}
                      alt={file.name ?? ""}
                      fill
                      sizes="(max-width: 640px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        {ticket.status !== "READ" && (
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate("READ")}
            disabled={updateStatus.isPending}
          >
            {updateStatus.isPending ? <Spinner /> : <IconEye className="size-4" />}
            Tandai Dibaca
          </Button>
        )}
        {ticket.status !== "RESOLVED" && (
          <Button
            onClick={() => handleStatusUpdate("RESOLVED")}
            disabled={updateStatus.isPending}
          >
            {updateStatus.isPending ? <Spinner /> : <IconCircleCheck className="size-4" />}
            Tandai Selesai
          </Button>
        )}
      </div>
    </div>
  );
};
