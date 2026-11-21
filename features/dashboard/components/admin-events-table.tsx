"use client";

import {
  IconDownload,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminConfirmDelete } from "@/features/dashboard/components/admin-confirm-delete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  useDeleteEvent,
  useSetEventEnvironment,
} from "@/hooks/use-admin-dashboard";
import type { TSetEventEnvironmentInput } from "@/schemas/admin-dashboard";
import type { TAdminEventRow } from "@/types/admin-dashboard";
import { formatDateShort, toPercent } from "@/utils/admin-dashboard";

const ENVIRONMENTS: TSetEventEnvironmentInput["environment"][] = [
  "local",
  "preview",
  "production",
];

type TAdminEventsTableProps = {
  rows: TAdminEventRow[];
};

export function AdminEventsTable({ rows }: TAdminEventsTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [environmentFilter, setEnvironmentFilter] = useState("ALL");

  const setEnvironment = useSetEventEnvironment();
  const removeEvent = useDeleteEvent();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((event) => {
      const matchEnvironment =
        environmentFilter === "ALL" || event.environment === environmentFilter;
      const matchQuery =
        needle === "" ||
        [event.title, event.slug, event.creatorName]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(needle));
      return matchEnvironment && matchQuery;
    });
  }, [rows, query, environmentFilter]);

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
        <div className="relative flex-1">
          <IconSearch
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-disabled"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
            {ENVIRONMENTS.map((environment) => (
              <SelectItem key={environment} value={environment}>
                {environment}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="footnote">
        Menampilkan {filtered.length} dari {rows.length} event
      </p>

      <div className="rounded-[10px] border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Peserta</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <p className="body text-text-disabled">Tidak ada event cocok.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      setEnvironmentFilter("ALL");
                    }}
                  >
                    Reset filter
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm text-text-primary">{event.title}</p>
                      <p className="footnote">
                        {event.creatorName ?? "Pembuat tidak diketahui"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {formatDateShort(event.date)}
                    <p className="footnote">draft s/d {formatDateShort(event.batasDaftar)}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-border text-text-secondary">
                      {event.joined}/{event.capacity} · {toPercent(event.joined, event.capacity)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={event.environment}
                      onValueChange={(value) =>
                        handleEnvironmentChange(event.id, value)
                      }
                      disabled={setEnvironment.isPending}
                    >
                      <SelectTrigger
                        className="h-8 w-32"
                        aria-label={`Environment ${event.title}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ENVIRONMENTS.map((environment) => (
                          <SelectItem key={environment} value={environment}>
                            {environment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        render={
                          <a
                            href={`/api/export/participants?eventId=${event.id}`}
                            download
                          />
                        }
                        variant="ghost"
                        size="sm"
                      >
                        <IconDownload aria-hidden />
                        Export
                      </Button>
                      <AdminConfirmDelete
                        title="Hapus event ini?"
                        description="Pendaftar dan log pembatalan ikut terhapus. Tindakan ini tidak dapat dibatalkan."
                        onConfirm={() => handleDelete(event.id)}
                        disabled={removeEvent.isPending}
                      >
                        <IconTrash aria-hidden />
                        Hapus
                      </AdminConfirmDelete>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
