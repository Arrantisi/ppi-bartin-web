"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPaginationItems } from "@/utils/admin-dashboard";

type TContentPaginationProps = {
  page: number;
  totalPages: number;
  onNavigate: (page: number) => void;
  label?: string;
};

/** Navigasi halaman daftar konten: prev/next + nomor dengan ellipsis. */
export function ContentPagination({
  page,
  totalPages,
  onNavigate,
  label = "Navigasi halaman",
}: TContentPaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(page, totalPages);

  return (
    <nav
      aria-label={label}
      className="mt-6 flex flex-wrap items-center justify-center gap-1.5"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onNavigate(page - 1)}
        aria-label="Halaman sebelumnya"
      >
        <IconChevronLeft aria-hidden />
        <span className="hidden sm:inline">Sebelumnya</span>
      </Button>

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden
            className="px-1 text-sm text-text-disabled"
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? "default" : "outline"}
            size="sm"
            aria-label={`Halaman ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onNavigate(item)}
            className={cn(
              "min-w-8 px-2 font-mono",
              item === page && "font-semibold",
            )}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onNavigate(page + 1)}
        aria-label="Halaman berikutnya"
      >
        <span className="hidden sm:inline">Berikutnya</span>
        <IconChevronRight aria-hidden />
      </Button>
    </nav>
  );
}
