"use client";

import { IconHelp } from "@tabler/icons-react";
import type { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** Tombol tanda tanya dengan penjelasan singkat untuk judul kartu ringkasan. */
export function FinanceInfoHint({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`Penjelasan ${label}`}
          className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-text-disabled outline-hidden transition-colors hover:text-text-secondary focus-visible:ring-2 focus-visible:ring-ring"
        >
          <IconHelp aria-hidden className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-64 text-balance">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
