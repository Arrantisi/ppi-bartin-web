"use client";

import { IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TFinanceFilters = {
  search: string;
  kategori: string;
  arusKas: string;
  mataUang: string;
};

type TFinanceToolbarProps = {
  filters: TFinanceFilters;
  onFiltersChange: (filters: TFinanceFilters) => void;
  categories: string[];
  canWrite: boolean;
  canRefresh: boolean;
  isFetching: boolean;
  onRefresh: () => void;
  onAdd: () => void;
};

/** Radix Select tidak menerima value="" — sentinel ini mewakili "Semua". */
const ALL = "all";

const asSelectValue = (value: string) => value || ALL;

export function FinanceToolbar({
  filters,
  onFiltersChange,
  categories,
  canWrite,
  canRefresh,
  isFetching,
  onRefresh,
  onAdd,
}: TFinanceToolbarProps) {
  const setFilter = (key: keyof TFinanceFilters, value: string) =>
    onFiltersChange({ ...filters, [key]: value === ALL ? "" : value });

  // Pertahanan lapis kedua: Radix Select menolak Select.Item dengan value="".
  const categoryOptions = categories.filter((category) => category.trim() !== "");

  return (
    <section aria-label="Filter transaksi" className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-56 flex-1">
            <IconSearch
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-secondary"
            />
            <Input
              type="search"
              aria-label="Cari transaksi"
              placeholder="Cari keterangan, PIC, atau rekening…"
              className="pl-9"
              value={filters.search}
              onChange={(event) => setFilter("search", event.target.value)}
            />
          </div>

          <div className="w-full sm:w-44">
            <Select
              value={asSelectValue(filters.kategori)}
              onValueChange={(value) => setFilter("kategori", value)}
            >
              <SelectTrigger size="sm" aria-label="Filter kategori">
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Semua kategori</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-36">
            <Select
              value={asSelectValue(filters.arusKas)}
              onValueChange={(value) => setFilter("arusKas", value)}
            >
              <SelectTrigger size="sm" aria-label="Filter arus kas">
                <SelectValue placeholder="Semua arus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Semua arus</SelectItem>
                <SelectItem value="Debit">Debit</SelectItem>
                <SelectItem value="Kredit">Kredit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-36">
            <Select
              value={asSelectValue(filters.mataUang)}
              onValueChange={(value) => setFilter("mataUang", value)}
            >
              <SelectTrigger size="sm" aria-label="Filter mata uang">
                <SelectValue placeholder="Semua mata uang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Semua mata uang</SelectItem>
                <SelectItem value="IDR">IDR</SelectItem>
                <SelectItem value="TRY">TRY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canRefresh && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Muat ulang data"
              disabled={isFetching}
              onClick={onRefresh}
            >
              <IconRefresh
                aria-hidden
                className={isFetching ? "animate-spin" : ""}
              />
            </Button>
          )}
          {canWrite && (
            <Button onClick={onAdd}>
              <IconPlus aria-hidden />
              Tambah Transaksi
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
