"use client";

import { IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { parseFinanceDate } from "@/utils/finance-parser";

type TFinanceDatePickerProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  describedBy?: string;
  labelledBy?: string;
};

/** Nilai form finance selalu ISO `yyyy-MM-dd`; Calendar bekerja dengan `Date`. */
function toDate(iso: string): Date | undefined {
  const parsed = parseFinanceDate(iso);
  if (!parsed) return undefined;

  const [year, month, day] = parsed.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function FinanceDatePicker({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  describedBy,
  labelledBy,
}: TFinanceDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-labelledby={labelledBy}
          onBlur={onBlur}
          className={cn(
            "w-full justify-start gap-2 font-normal",
            !selected && "text-text-disabled",
          )}
        >
          <IconCalendar
            aria-hidden
            className="size-4 shrink-0 text-text-secondary"
          />
          <span className={cn("truncate", selected && "font-mono")}>
            {selected
              ? format(selected, "d MMM yyyy", { locale: idLocale })
              : "Pilih tanggal"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            if (!date) return;
            onChange(format(date, "yyyy-MM-dd"));
            onBlur?.();
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
