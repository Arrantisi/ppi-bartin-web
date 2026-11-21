"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPaginationItems } from "@/utils/admin-dashboard";

type TAdminTablePaginationProps = {
  page: number;
  totalPages: number;
  onNavigate: (page: number) => void;
};

/** Navigasi tabel: prev/next + nomor halaman dengan ellipsis untuk rentang panjang. */
export function AdminTablePagination({
  page,
  totalPages,
  onNavigate,
}: TAdminTablePaginationProps) {
  const items = getPaginationItems(page, totalPages);

  return (
    <nav
      aria-label="Navigasi halaman tabel"
      className="flex flex-wrap items-center justify-end gap-1.5"
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
            className={cn("min-w-8 px-2 font-mono", item === page && "font-semibold")}
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
