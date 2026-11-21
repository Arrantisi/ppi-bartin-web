"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type TAdminDetailDialogProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isLoading: boolean;
  isError: boolean;
  data: T | null | undefined;
  /** Kartu event/berita butuh ruang lebih lebar dari kartu user. */
  contentClassName?: string;
  /** Tombol muat ulang saat detail gagal / kosong. */
  onRetry?: () => void;
  children: (data: T) => ReactNode;
};

function DetailSkeleton() {
  return (
    <div className="space-y-3" aria-label="Memuat detail">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

/** Kartu detail generik untuk tabel admin: skeleton → error → empty → konten. */
export function AdminDetailDialog<T>({
  open,
  onOpenChange,
  title,
  description,
  isLoading,
  isError,
  data,
  contentClassName,
  onRetry,
  children,
}: TAdminDetailDialogProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[85vh] min-w-0 overflow-x-hidden overflow-y-auto sm:max-w-2xl",
          contentClassName,
        )}
      >
        <DialogHeader className="min-w-0">
          <DialogTitle className="break-words">{title}</DialogTitle>
          <DialogDescription className="break-words">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div role="status" aria-live="polite" className="min-w-0">
          {isLoading ? (
            <DetailSkeleton />
          ) : isError ? (
            <div className="space-y-3 text-center">
              <p className="body text-danger">
                Detail gagal dimuat. Silakan coba lagi.
              </p>
              {onRetry ? (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  Muat ulang
                </Button>
              ) : null}
            </div>
          ) : !data ? (
            <div className="space-y-3 text-center">
              <p className="body text-text-disabled">Data tidak ditemukan.</p>
              {onRetry ? (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  Muat ulang
                </Button>
              ) : null}
            </div>
          ) : (
            children(data)
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Blok informasi dengan judul, dipakai kartu detail event/berita. */
export function AdminDetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="subheadline text-text-secondary">{title}</h3>
      <div className="min-w-0 rounded-[10px] border border-border bg-background p-4">
        {children}
      </div>
    </section>
  );
}

/** Deretan statistik ringkas di atas kartu detail. */
export function AdminDetailStats({
  items,
}: {
  items: Array<{ label: string; value: ReactNode; hint?: string }>;
}) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[10px] border border-border bg-surface-hover p-3"
        >
          <p className="footnote text-text-secondary">{item.label}</p>
          <p className="mt-1 break-words font-mono text-base text-text-primary">
            {item.value}
          </p>
          {item.hint ? (
            <p className="footnote mt-0.5 text-text-secondary">{item.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** Baris label/nilai di dalam kartu detail. */
export function AdminDetailField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  const display =
    value === null || value === undefined || value === "" ? "—" : value;

  return (
    <div className="space-y-1 border-b border-border py-2 last:border-b-0">
      <dt className="footnote text-text-secondary">{label}</dt>
      <dd
        className={cn(
          "body whitespace-pre-wrap break-words text-text-primary",
          mono && "break-all font-mono",
        )}
      >
        {display}
      </dd>
    </div>
  );
}
