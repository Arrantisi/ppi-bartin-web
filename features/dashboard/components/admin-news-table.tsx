"use client";

import { IconSearch, IconTrash } from "@tabler/icons-react";
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
  useDeleteNews,
  useSetNewsEnvironment,
} from "@/hooks/use-admin-dashboard";
import type { TSetNewsEnvironmentInput } from "@/schemas/admin-dashboard";
import type { TAdminNewsRow } from "@/types/admin-dashboard";
import { formatDateShort } from "@/utils/admin-dashboard";

const ENVIRONMENTS: TSetNewsEnvironmentInput["environment"][] = [
  "local",
  "preview",
  "production",
];

type TAdminNewsTableProps = {
  rows: TAdminNewsRow[];
};

export function AdminNewsTable({ rows }: TAdminNewsTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [environmentFilter, setEnvironmentFilter] = useState("ALL");

  const setEnvironment = useSetNewsEnvironment();
  const removeNews = useDeleteNews();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((news) => {
      const matchEnvironment =
        environmentFilter === "ALL" || news.environment === environmentFilter;
      const matchQuery =
        needle === "" ||
        [news.judul, news.slug, news.category, news.creatorName]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(needle));
      return matchEnvironment && matchQuery;
    });
  }, [rows, query, environmentFilter]);

  const handleEnvironmentChange = (newsId: string, value: string) => {
    setEnvironment.mutate(
      {
        newsId,
        environment: value as TSetNewsEnvironmentInput["environment"],
      },
      {
        onSuccess: (result) => {
          if (result.success) router.refresh();
        },
      },
    );
  };

  const handleDelete = async (newsId: string) => {
    const result = await removeNews.mutateAsync({ newsId });
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
            placeholder="Cari judul, slug, kategori, atau penulis"
            aria-label="Cari berita"
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
        Menampilkan {filtered.length} dari {rows.length} berita
      </p>

      <div className="rounded-[10px] border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Berita</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Diperbarui</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <p className="body text-text-disabled">Tidak ada berita cocok.</p>
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
              filtered.map((news) => (
                <TableRow key={news.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm text-text-primary">{news.judul}</p>
                      <p className="footnote">/{news.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-border text-text-secondary">
                      {news.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {news.creatorName ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {formatDateShort(news.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={news.environment}
                      onValueChange={(value) =>
                        handleEnvironmentChange(news.id, value)
                      }
                      disabled={setEnvironment.isPending}
                    >
                      <SelectTrigger
                        className="h-8 w-32"
                        aria-label={`Environment ${news.judul}`}
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
                  <TableCell className="text-right">
                    <AdminConfirmDelete
                      title="Hapus berita ini?"
                      description="Gambar terkait akan ikut dihapus. Tindakan ini tidak dapat dibatalkan."
                      onConfirm={() => handleDelete(news.id)}
                      disabled={removeNews.isPending}
                    >
                      <IconTrash aria-hidden />
                      Hapus
                    </AdminConfirmDelete>
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
