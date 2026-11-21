"use client";

import { IconDownload, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AdminColumnToggle } from "@/features/dashboard/components/admin-column-toggle";
import {
  AdminDetailDialog,
  AdminDetailField,
  AdminDetailSection,
  AdminDetailStats,
} from "@/features/dashboard/components/admin-detail-dialog";
import { AdminRowActions } from "@/features/dashboard/components/admin-row-actions";
import { AdminTablePagination } from "@/features/dashboard/components/admin-table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminEventDetail,
  useDeleteEvent,
  useSetEventEnvironment,
} from "@/hooks/use-admin-dashboard";
import type { TSetEventEnvironmentInput } from "@/schemas/admin-dashboard";
import type { TAdminEventRow, TAdminTablePage } from "@/types/admin-dashboard";
import {
  formatDateFull,
  formatDateShort,
  toPercent,
} from "@/utils/admin-dashboard";

const ENVIRONMENTS: TSetEventEnvironmentInput["environment"][] = [
  "local",
  "preview",
  "production",
];

const COLUMNS = [
  { key: "event", label: "Event" },
  { key: "date", label: "Tanggal" },
  { key: "participants", label: "Peserta" },
  { key: "environment", label: "Environment" },
] as const;

type TEventColumnKey = (typeof COLUMNS)[number]["key"];

const allColumnsVisible = (): Record<TEventColumnKey, boolean> =>
  Object.fromEntries(COLUMNS.map((column) => [column.key, true])) as Record<
    TEventColumnKey,
    boolean
  >;

type TAdminEventsTableProps = {
  page: TAdminTablePage<TAdminEventRow>;
  query: string;
  environment: string;
};

export function AdminEventsTable({
  page,
  query,
  environment,
}: TAdminEventsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [queryInput, setQueryInput] = useState(query);
  const [environmentFilter, setEnvironmentFilter] = useState(environment);
  const [visibleColumns, setVisibleColumns] =
    useState<Record<TEventColumnKey, boolean>>(allColumnsVisible);
  const [selectedEvent, setSelectedEvent] = useState<TAdminEventRow | null>(null);

  const setEnvironment = useSetEventEnvironment();
  const removeEvent = useDeleteEvent();
  const detail = useAdminEventDetail(selectedEvent?.id ?? null);

  useEffect(() => {
    setQueryInput(query);
  }, [query]);

  useEffect(() => {
    setEnvironmentFilter(environment);
  }, [environment]);

  const visibleCount = COLUMNS.filter(
    (column) => visibleColumns[column.key],
  ).length;

  const buildHref = (next: {
    page?: number;
    query?: string;
    environment?: string;
  }) => {
    const params = new URLSearchParams();
    const nextQuery = next.query ?? queryInput;
    const nextEnvironment = next.environment ?? environmentFilter;
    const nextPage = next.page ?? page.page;
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextEnvironment !== "ALL") params.set("environment", nextEnvironment);
    if (nextPage > 1) params.set("page", String(nextPage));
    const search = params.toString();
    return search ? `${pathname}?${search}` : pathname;
  };

  const submitFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(buildHref({ page: 1 }));
  };

  const resetFilters = () => {
    setQueryInput("");
    setEnvironmentFilter("ALL");
    router.push(pathname);
  };

  const handleEnvironmentChange = (eventId: string, value: string) => {
    setEnvironment.mutate(
      {
        eventId,
        environment: value as TSetEventEnvironmentInput["environment"],
      },
      {
        onSuccess: (result) => {
          if (result.success) router.refresh();
        },
      },
    );
  };

  const handleDelete = async (eventId: string) => {
    const result = await removeEvent.mutateAsync({ eventId });
    if (result.success) router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={submitFilters}
        >
          <div className="relative min-w-0 flex-1">
            <IconSearch
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-disabled"
            />
            <Input
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Cari judul, slug, atau pembuat"
              aria-label="Cari event"
              className="pl-9"
            />
          </div>
          <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
            <SelectTrigger className="w-full sm:w-40" aria-label="Filter environment">
              <SelectValue placeholder="Semua environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua environment</SelectItem>
              {ENVIRONMENTS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" variant="outline" size="sm">
            Terapkan
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </form>
        <AdminColumnToggle
          columns={COLUMNS}
          visible={visibleColumns}
          onChange={setVisibleColumns}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="footnote">
          Menampilkan {page.rows.length} dari {page.total} event yang cocok
        </p>
        <p className="footnote">
          Halaman {page.page} dari {page.totalPages}
        </p>
      </div>

      <div className="min-w-0 w-full rounded-[10px] border border-border bg-card">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              {visibleColumns.event ? (
                <TableHead className="w-[34%]">Event</TableHead>
              ) : null}
              {visibleColumns.date ? (
                <TableHead className="w-[20%]">Tanggal</TableHead>
              ) : null}
              {visibleColumns.participants ? (
                <TableHead className="w-[16%]">Peserta</TableHead>
              ) : null}
              {visibleColumns.environment ? (
                <TableHead className="w-[18%]">Environment</TableHead>
              ) : null}
              <TableHead className="w-[12%] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleCount + 1} className="py-12 text-center">
                  <p className="body text-text-disabled">Tidak ada event cocok.</p>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset filter
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              page.rows.map((event) => (
                <TableRow key={event.id}>
                  {visibleColumns.event ? (
                    <TableCell className="min-w-0 whitespace-normal">
                      <div className="min-w-0 space-y-0.5">
                        <button
                          type="button"
                          className="line-clamp-2 break-words text-left text-sm text-text-primary hover:underline"
                          onClick={() => setSelectedEvent(event)}
                          title={event.title}
                        >
                          {event.title}
                        </button>
                        <p className="footnote truncate" title={event.creatorName ?? undefined}>
                          {event.creatorName ?? "Pembuat tidak diketahui"}
                        </p>
                      </div>
                    </TableCell>
                  ) : null}
                  {visibleColumns.date ? (
                    <TableCell className="min-w-0 whitespace-normal text-sm text-text-secondary">
                      {formatDateShort(event.date)}
                      <p className="footnote">
                        draft s/d {formatDateShort(event.batasDaftar)}
                      </p>
                    </TableCell>
                  ) : null}
                  {visibleColumns.participants ? (
                    <TableCell className="min-w-0 whitespace-normal">
                      <Badge
                        variant="outline"
                        className="max-w-full border-border text-text-secondary"
                      >
                        <span className="truncate">
                          {event.joined}/{event.capacity} ·{" "}
                          {toPercent(event.joined, event.capacity)}%
                        </span>
                      </Badge>
                    </TableCell>
                  ) : null}
                  {visibleColumns.environment ? (
                    <TableCell>
                      <Select
                        value={event.environment}
                        onValueChange={(value) =>
                          handleEnvironmentChange(event.id, value)
                        }
                        disabled={setEnvironment.isPending}
                      >
                        <SelectTrigger
                          className="h-8 w-full max-w-[8rem]"
                          aria-label={`Environment ${event.title}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ENVIRONMENTS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  ) : null}
                  <TableCell className="text-right">
                    <AdminRowActions
                      label={`Aksi ${event.title}`}
                      onDetail={() => setSelectedEvent(event)}
                      deleteTitle="Hapus event ini?"
                      deleteDescription="Pendaftar, log pembatalan, dan file gambar ikut terhapus. Tindakan ini tidak dapat dibatalkan."
                      onDelete={() => handleDelete(event.id)}
                      deleteDisabled={removeEvent.isPending}
                    >
                      <DropdownMenuItem asChild>
                        <a
                          href={`/api/export/participants?eventId=${event.id}`}
                          download
                        >
                          <IconDownload aria-hidden />
                          Export peserta
                        </a>
                      </DropdownMenuItem>
                    </AdminRowActions>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdminTablePagination
        page={page.page}
        totalPages={page.totalPages}
        onNavigate={(nextPage) => router.push(buildHref({ page: nextPage }))}
      />

      <AdminDetailDialog
        open={selectedEvent !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
        title={selectedEvent?.title ?? "Detail event"}
        description="Kartu acara — ringkasan, kuota, dan informasi lengkap."
        contentClassName="sm:max-w-3xl"
        isLoading={detail.isLoading}
        isError={detail.isError}
        data={detail.data}
        onRetry={() => void detail.refetch()}
      >
        {(event) => {
          const filled = toPercent(event.joined, event.capacity);
          return (
            <div className="min-w-0 space-y-5">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="max-w-full border-primary/30 text-primary"
                >
                  <span className="truncate">{event.environment}</span>
                </Badge>
                {event.catagory ? (
                  <Badge
                    variant="outline"
                    className="max-w-full border-border text-text-secondary"
                  >
                    <span className="truncate">{event.catagory}</span>
                  </Badge>
                ) : null}
                <span className="footnote min-w-0 break-all text-text-secondary">
                  /{event.slug}
                </span>
              </div>

              <AdminDetailStats
                items={[
                  {
                    label: "Tanggal acara",
                    value: formatDateShort(event.date),
                    hint: formatDateFull(event.date),
                  },
                  {
                    label: "Batas daftar",
                    value: formatDateShort(event.batasDaftar),
                    hint: formatDateFull(event.batasDaftar),
                  },
                  {
                    label: "Pendaftar",
                    value: event.joined,
                    hint: `dari ${event.capacity} kuota`,
                  },
                  {
                    label: "Dibatalkan",
                    value: event.cancelled,
                    hint: "peserta",
                  },
                ]}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="footnote text-text-secondary">Kuota terisi</p>
                  <p className="font-mono text-sm text-text-primary">
                    {filled}%
                  </p>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-surface-hover"
                  role="progressbar"
                  aria-label="Kuota terisi"
                  aria-valuenow={filled}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${filled}%` }}
                  />
                </div>
              </div>

              <AdminDetailSection title="Tentang acara">
                <div className="min-w-0 space-y-3">
                  <div className="space-y-1">
                    <p className="footnote text-text-secondary">Lokasi</p>
                    <p className="body break-words text-text-primary">
                      {event.lokasi}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="footnote text-text-secondary">Deskripsi</p>
                    <p className="body whitespace-pre-wrap break-words text-text-primary">
                      {event.deskripsi}
                    </p>
                  </div>
                  {event.persyaratan ? (
                    <div className="space-y-1">
                      <p className="footnote text-text-secondary">Persyaratan</p>
                      <p className="body whitespace-pre-wrap break-words text-text-primary">
                        {event.persyaratan}
                      </p>
                    </div>
                  ) : null}
                </div>
              </AdminDetailSection>

              <AdminDetailSection title="Metadata">
                <dl>
                  <AdminDetailField label="Pembuat" value={event.creatorName} />
                  <AdminDetailField label="Slug" value={event.slug} mono />
                  <AdminDetailField
                    label="Dibuat"
                    value={formatDateFull(event.createdAt)}
                  />
                  <AdminDetailField
                    label="Diperbarui"
                    value={formatDateFull(event.updatedAt)}
                  />
                </dl>
              </AdminDetailSection>
            </div>
          );
        }}
      </AdminDetailDialog>
    </div>
  );
}
