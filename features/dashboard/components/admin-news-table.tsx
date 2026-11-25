"use client";

import { IconSearch } from "@tabler/icons-react";
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
  useAdminNewsDetail,
  useDeleteNews,
  useSetNewsEnvironment,
} from "@/hooks/use-admin-dashboard";
import type { TSetNewsEnvironmentInput } from "@/schemas/admin-dashboard";
import type { TAdminNewsRow, TAdminTablePage } from "@/types/admin-dashboard";
import { formatDateFull, formatDateShort } from "@/utils/admin-dashboard";

const ENVIRONMENTS: TSetNewsEnvironmentInput["environment"][] = [
  "local",
  "preview",
  "production",
];

const COLUMNS = [
  { key: "news", label: "Berita" },
  { key: "category", label: "Kategori" },
  { key: "creator", label: "Penulis" },
  { key: "updatedAt", label: "Diperbarui" },
  { key: "environment", label: "Environment" },
] as const;

type TNewsColumnKey = (typeof COLUMNS)[number]["key"];

const allColumnsVisible = (): Record<TNewsColumnKey, boolean> =>
  Object.fromEntries(COLUMNS.map((column) => [column.key, true])) as Record<
    TNewsColumnKey,
    boolean
  >;

type TAdminNewsTableProps = {
  page: TAdminTablePage<TAdminNewsRow>;
  query: string;
  environment: string;
};

export function AdminNewsTable({
  page,
  query,
  environment,
}: TAdminNewsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [queryInput, setQueryInput] = useState(query);
  const [environmentFilter, setEnvironmentFilter] = useState(environment);
  const [visibleColumns, setVisibleColumns] =
    useState<Record<TNewsColumnKey, boolean>>(allColumnsVisible);
  const [selectedNews, setSelectedNews] = useState<TAdminNewsRow | null>(null);

  const setEnvironment = useSetNewsEnvironment();
  const removeNews = useDeleteNews();
  const detail = useAdminNewsDetail(selectedNews?.id ?? null);

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
          Menampilkan {page.rows.length} dari {page.total} berita yang cocok
        </p>
        <p className="footnote">
          Halaman {page.page} dari {page.totalPages}
        </p>
      </div>

      <div className="min-w-0 w-full rounded-[10px] border border-border bg-card">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              {visibleColumns.news ? (
                <TableHead className="w-[32%]">Berita</TableHead>
              ) : null}
              {visibleColumns.category ? (
                <TableHead className="w-[12%]">Kategori</TableHead>
              ) : null}
              {visibleColumns.creator ? (
                <TableHead className="w-[15%]">Penulis</TableHead>
              ) : null}
              {visibleColumns.updatedAt ? (
                <TableHead className="w-[14%]">Diperbarui</TableHead>
              ) : null}
              {visibleColumns.environment ? (
                <TableHead className="w-[15%]">Environment</TableHead>
              ) : null}
              <TableHead className="w-[12%] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleCount + 1} className="py-12 text-center">
                  <p className="body text-text-disabled">Tidak ada berita cocok.</p>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset filter
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              page.rows.map((news) => (
                <TableRow key={news.id}>
                  {visibleColumns.news ? (
                    <TableCell className="min-w-0 whitespace-normal">
                      <div className="min-w-0 space-y-0.5">
                        <button
                          type="button"
                          className="line-clamp-2 break-words text-left text-sm text-text-primary hover:underline"
                          onClick={() => setSelectedNews(news)}
                          title={news.judul}
                        >
                          {news.judul}
                        </button>
                        <p className="footnote truncate" title={`/${news.slug}`}>
                          /{news.slug}
                        </p>
                      </div>
                    </TableCell>
                  ) : null}
                  {visibleColumns.category ? (
                    <TableCell className="min-w-0 whitespace-normal">
                      <Badge
                        variant="outline"
                        className="max-w-full border-border text-text-secondary"
                      >
                        <span className="truncate">{news.category}</span>
                      </Badge>
                    </TableCell>
                  ) : null}
                  {visibleColumns.creator ? (
                    <TableCell className="min-w-0 whitespace-normal text-sm text-text-secondary">
                      <span className="block truncate" title={news.creatorName ?? undefined}>
                        {news.creatorName ?? "—"}
                      </span>
                    </TableCell>
                  ) : null}
                  {visibleColumns.updatedAt ? (
                    <TableCell className="min-w-0 whitespace-normal text-sm text-text-secondary">
                      {formatDateShort(news.updatedAt)}
                    </TableCell>
                  ) : null}
                  {visibleColumns.environment ? (
                    <TableCell>
                      <Select
                        value={news.environment}
                        onValueChange={(value) =>
                          handleEnvironmentChange(news.id, value)
                        }
                        disabled={setEnvironment.isPending}
                      >
                        <SelectTrigger
                          className="h-8 w-full max-w-[8rem]"
                          aria-label={`Environment ${news.judul}`}
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
                      label={`Aksi ${news.judul}`}
                      onDetail={() => setSelectedNews(news)}
                      deleteTitle="Hapus berita ini?"
                      deleteDescription="Gambar terkait ikut dihapus dari storage. Tindakan ini tidak dapat dibatalkan."
                      onDelete={() => handleDelete(news.id)}
                      deleteDisabled={removeNews.isPending}
                    />
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
        open={selectedNews !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedNews(null);
        }}
        title={selectedNews?.judul ?? "Detail berita"}
        description="Pratinjau artikel — ringkasan, isi, dan informasi publikasi."
        contentClassName="sm:max-w-3xl"
        isLoading={detail.isLoading}
        isError={detail.isError}
        data={detail.data}
        onRetry={() => void detail.refetch()}
      >
        {(news) => (
          <div className="min-w-0 space-y-5">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="max-w-full border-primary/30 text-primary"
              >
                <span className="truncate">{news.environment}</span>
              </Badge>
              <Badge
                variant="outline"
                className="max-w-full border-border text-text-secondary"
              >
                <span className="truncate">{news.catagory}</span>
              </Badge>
              <span className="footnote min-w-0 break-all text-text-secondary">
                /{news.slug}
              </span>
            </div>

            <AdminDetailStats
              items={[
                { label: "Kategori", value: news.catagory },
                { label: "Status tayang", value: news.environment },
                {
                  label: "Dibuat",
                  value: formatDateShort(news.createdAt),
                  hint: formatDateFull(news.createdAt),
                },
                {
                  label: "Diperbarui",
                  value: formatDateShort(news.updatedAt),
                  hint: formatDateFull(news.updatedAt),
                },
              ]}
            />

            <section className="min-w-0 space-y-2">
              <h3 className="subheadline text-text-secondary">Ringkasan</h3>
              <blockquote className="break-words rounded-r-[10px] border-l-2 border-primary bg-surface-hover px-4 py-3 text-sm italic text-text-primary">
                {news.ringkasan}
              </blockquote>
            </section>

            <AdminDetailSection title="Isi artikel">
              <p className="body whitespace-pre-wrap break-words leading-relaxed text-text-primary">
                {news.desckripsi}
              </p>
            </AdminDetailSection>

            <AdminDetailSection title="Informasi publikasi">
              <dl>
                <AdminDetailField label="Penulis" value={news.creatorName} />
                <AdminDetailField label="Slug" value={news.slug} mono />
                <AdminDetailField
                  label="Dibuat"
                  value={formatDateFull(news.createdAt)}
                />
                <AdminDetailField
                  label="Diperbarui"
                  value={formatDateFull(news.updatedAt)}
                />
              </dl>
            </AdminDetailSection>
          </div>
        )}
      </AdminDetailDialog>
    </div>
  );
}
