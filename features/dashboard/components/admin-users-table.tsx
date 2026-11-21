"use client";

import {
  IconBan,
  IconCircleCheck,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminColumnToggle } from "@/features/dashboard/components/admin-column-toggle";
import {
  AdminDetailDialog,
  AdminDetailField,
  AdminDetailSection,
} from "@/features/dashboard/components/admin-detail-dialog";
import { AdminRowActions } from "@/features/dashboard/components/admin-row-actions";
import { AdminTablePagination } from "@/features/dashboard/components/admin-table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useAdminUserDetail,
  useDeleteUser,
  useSetUserBan,
  useUpdateUserRole,
} from "@/hooks/use-admin-dashboard";
import type { TUpdateUserRoleInput } from "@/schemas/admin-dashboard";
import type { TAdminTablePage, TAdminUserRow } from "@/types/admin-dashboard";
import {
  formatDateFull,
  formatDateShort,
} from "@/utils/admin-dashboard";

const ROLES: TUpdateUserRoleInput["role"][] = [
  "USER",
  "ADMIN",
  "PENGURUS",
  "BENDAHARA",
];

const COLUMNS = [
  { key: "user", label: "Pengguna" },
  { key: "role", label: "Role" },
  { key: "angkatan", label: "Angkatan / Fakultas" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Bergabung" },
] as const;

type TUserColumnKey = (typeof COLUMNS)[number]["key"];

const allColumnsVisible = (): Record<TUserColumnKey, boolean> =>
  Object.fromEntries(COLUMNS.map((column) => [column.key, true])) as Record<
    TUserColumnKey,
    boolean
  >;

type TAdminUsersTableProps = {
  page: TAdminTablePage<TAdminUserRow>;
  query: string;
  role: string;
  currentUserId: string;
};

export function AdminUsersTable({
  page,
  query,
  role,
  currentUserId,
}: TAdminUsersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [queryInput, setQueryInput] = useState(query);
  const [roleFilter, setRoleFilter] = useState(role);
  const [visibleColumns, setVisibleColumns] =
    useState<Record<TUserColumnKey, boolean>>(allColumnsVisible);
  const [selectedUser, setSelectedUser] = useState<TAdminUserRow | null>(null);
  const [banTarget, setBanTarget] = useState<TAdminUserRow | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banExpires, setBanExpires] = useState("");

  const updateRole = useUpdateUserRole();
  const setBan = useSetUserBan();
  const removeUser = useDeleteUser();
  const detail = useAdminUserDetail(selectedUser?.id ?? null);

  useEffect(() => {
    setQueryInput(query);
  }, [query]);

  useEffect(() => {
    setRoleFilter(role);
  }, [role]);

  const visibleCount = COLUMNS.filter(
    (column) => visibleColumns[column.key],
  ).length;

  const buildHref = (next: { page?: number; query?: string; role?: string }) => {
    const params = new URLSearchParams();
    const nextQuery = next.query ?? queryInput;
    const nextRole = next.role ?? roleFilter;
    const nextPage = next.page ?? page.page;
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextRole !== "ALL") params.set("role", nextRole);
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
    setRoleFilter("ALL");
    router.push(pathname);
  };

  const handleRoleChange = (userId: string, value: string) => {
    updateRole.mutate(
      { userId, role: value as TUpdateUserRoleInput["role"] },
      {
        onSuccess: (result) => {
          if (result.success) router.refresh();
        },
      },
    );
  };

  const handleUnban = (user: TAdminUserRow) => {
    setBan.mutate(
      { userId: user.id, banned: false },
      {
        onSuccess: (result) => {
          if (result.success) router.refresh();
        },
      },
    );
  };

  const handleBanConfirm = () => {
    if (!banTarget) return;

    let expiresIso: string | null = null;
    if (banExpires.trim()) {
      const date = new Date(banExpires);
      if (Number.isNaN(date.getTime())) {
        toast.error("Tanggal berakhir tidak valid");
        return;
      }
      expiresIso = date.toISOString();
    }

    setBan.mutate(
      {
        userId: banTarget.id,
        banned: true,
        banReason: banReason.trim() || null,
        banExpires: expiresIso,
      },
      {
        onSuccess: (result) => {
          if (!result.success) return;
          setBanTarget(null);
          setBanReason("");
          setBanExpires("");
          router.refresh();
        },
      },
    );
  };

  const handleDelete = async (userId: string) => {
    const result = await removeUser.mutateAsync({ userId });
    if (result.success) router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={submitFilters}
        >
          <div className="relative flex-1">
            <IconSearch
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-disabled"
            />
            <Input
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Cari nama, email, username, atau no. siswa"
              aria-label="Cari user"
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40" aria-label="Filter role">
              <SelectValue placeholder="Semua role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua role</SelectItem>
              {ROLES.map((roleOption) => (
                <SelectItem key={roleOption} value={roleOption}>
                  {roleOption}
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
          Menampilkan {page.rows.length} dari {page.total} user yang cocok
        </p>
        <p className="footnote">
          Halaman {page.page} dari {page.totalPages}
        </p>
      </div>

      <div className="rounded-[10px] border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.user ? <TableHead>Pengguna</TableHead> : null}
              {visibleColumns.role ? <TableHead>Role</TableHead> : null}
              {visibleColumns.angkatan ? (
                <TableHead>Angkatan / Fakultas</TableHead>
              ) : null}
              {visibleColumns.status ? <TableHead>Status</TableHead> : null}
              {visibleColumns.createdAt ? <TableHead>Bergabung</TableHead> : null}
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleCount + 1} className="py-12 text-center">
                  <p className="body text-text-disabled">Tidak ada user cocok.</p>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset filter
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              page.rows.map((user) => {
                const isSelf = user.id === currentUserId;
                return (
                  <TableRow key={user.id}>
                    {visibleColumns.user ? (
                      <TableCell>
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            className="text-left text-sm text-text-primary hover:underline"
                            onClick={() => setSelectedUser(user)}
                          >
                            {user.name ?? user.username ?? "Tanpa nama"}
                          </button>
                          <p className="footnote">{user.email}</p>
                        </div>
                      </TableCell>
                    ) : null}
                    {visibleColumns.role ? (
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                          disabled={updateRole.isPending || isSelf}
                        >
                          <SelectTrigger
                            className="h-8 w-32"
                            aria-label={`Role ${user.name ?? user.email}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((roleOption) => (
                              <SelectItem key={roleOption} value={roleOption}>
                                {roleOption}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    ) : null}
                    {visibleColumns.angkatan ? (
                      <TableCell>
                        <p className="text-sm text-text-secondary">
                          {user.angkatan ?? "—"}
                        </p>
                        <p className="footnote">{user.fakultas ?? "—"}</p>
                      </TableCell>
                    ) : null}
                    {visibleColumns.status ? (
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              user.banned
                                ? "border-danger/30 text-danger"
                                : "border-success/30 text-success"
                            }
                          >
                            {user.banned ? "Diblokir" : "Aktif"}
                          </Badge>
                          {isSelf ? (
                            <Badge
                              variant="outline"
                              className="border-border text-text-secondary"
                            >
                              Akun Anda
                            </Badge>
                          ) : null}
                        </div>
                        {user.banExpires ? (
                          <p className="footnote mt-1">
                            s/d {formatDateShort(user.banExpires)}
                          </p>
                        ) : null}
                      </TableCell>
                    ) : null}
                    {visibleColumns.createdAt ? (
                      <TableCell className="text-sm text-text-secondary">
                        {formatDateShort(user.createdAt)}
                      </TableCell>
                    ) : null}
                    <TableCell className="text-right">
                      <AdminRowActions
                        label={`Aksi ${user.name ?? user.username ?? user.email}`}
                        onDetail={() => setSelectedUser(user)}
                        deleteTitle="Hapus user ini?"
                        deleteDescription="Tiket CS, event, berita, peserta, dan file terkait ikut terhapus. Tindakan ini tidak dapat dibatalkan."
                        onDelete={() => handleDelete(user.id)}
                        deleteDisabled={removeUser.isPending || isSelf}
                      >
                        <DropdownMenuItem
                          disabled={setBan.isPending || isSelf}
                          onSelect={() =>
                            user.banned ? handleUnban(user) : setBanTarget(user)
                          }
                        >
                          {user.banned ? (
                            <IconCircleCheck aria-hidden />
                          ) : (
                            <IconBan aria-hidden />
                          )}
                          {user.banned ? "Buka blokir" : "Blokir"}
                        </DropdownMenuItem>
                      </AdminRowActions>
                    </TableCell>
                  </TableRow>
                );
              })
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
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
        title={
          selectedUser?.name ?? selectedUser?.username ?? "Detail pengguna"
        }
        description="Informasi lengkap akun yang dipilih."
        isLoading={detail.isLoading}
        isError={detail.isError}
        data={detail.data}
        onRetry={() => void detail.refetch()}
      >
        {(user) => (
          <div className="space-y-5">
            <AdminDetailSection title="Identitas">
              <dl>
                <AdminDetailField label="Nama" value={user.name} />
                <AdminDetailField label="Username" value={user.username} />
                <AdminDetailField label="Email" value={user.email} mono />
                <AdminDetailField label="No. Siswa" value={user.nomorSiswa} mono />
                <AdminDetailField
                  label="No. Telepon"
                  value={user.noTelephone}
                  mono
                />
                <AdminDetailField label="Angkatan" value={user.angkatan} />
                <AdminDetailField label="Jurusan" value={user.jurusan} />
                <AdminDetailField label="Fakultas" value={user.fakultas} />
                <AdminDetailField
                  label="Jenis kelamin"
                  value={user.jenisKelamin}
                />
                <AdminDetailField
                  label="Status pelajar"
                  value={user.statusPelajar}
                />
                <AdminDetailField label="Alamat" value={user.alamat} />
                <AdminDetailField label="Bio" value={user.bio} />
              </dl>
            </AdminDetailSection>

            <AdminDetailSection title="Akun & akses">
              <dl>
                <AdminDetailField label="Role" value={user.role} />
                <AdminDetailField
                  label="Status email"
                  value={
                    user.emailVerified ? "Terverifikasi" : "Belum terverifikasi"
                  }
                />
                <AdminDetailField
                  label="Status akun"
                  value={user.banned ? "Diblokir" : "Aktif"}
                />
                <AdminDetailField label="Alasan blokir" value={user.banReason} />
                <AdminDetailField
                  label="Blokir hingga"
                  value={formatDateFull(user.banExpires)}
                />
              </dl>
            </AdminDetailSection>

            <AdminDetailSection title="Aktivitas">
              <dl>
                <AdminDetailField
                  label="Bergabung"
                  value={formatDateFull(user.createdAt)}
                />
                <AdminDetailField
                  label="Diperbarui"
                  value={formatDateFull(user.updatedAt)}
                />
              </dl>
            </AdminDetailSection>
          </div>
        )}
      </AdminDetailDialog>

      <Dialog
        open={banTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setBanTarget(null);
            setBanReason("");
            setBanExpires("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blokir {banTarget?.name ?? banTarget?.email}</DialogTitle>
            <DialogDescription>
              Alasan dan tanggal berakhir bersifat opsional. Kosongkan tanggal untuk
              blokir permanen.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="ban-reason">Alasan blokir</Label>
              <Input
                id="ban-reason"
                value={banReason}
                onChange={(event) => setBanReason(event.target.value)}
                maxLength={300}
                placeholder="Contoh: melanggar aturan komunitas"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ban-expires">Berlaku sampai</Label>
              <Input
                id="ban-expires"
                type="datetime-local"
                value={banExpires}
                onChange={(event) => setBanExpires(event.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanTarget(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleBanConfirm}
              disabled={setBan.isPending}
            >
              Blokir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
