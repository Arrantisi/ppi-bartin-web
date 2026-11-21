"use client";

import { IconBan, IconCircleCheck, IconSearch, IconTrash } from "@tabler/icons-react";
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
  useDeleteUser,
  useSetUserBan,
  useUpdateUserRole,
} from "@/hooks/use-admin-dashboard";
import type { TUpdateUserRoleInput } from "@/schemas/admin-dashboard";
import type { TAdminUserRow } from "@/types/admin-dashboard";
import { formatDateShort } from "@/utils/admin-dashboard";

const ROLES: TUpdateUserRoleInput["role"][] = [
  "USER",
  "ADMIN",
  "PENGURUS",
  "BENDAHARA",
];

type TAdminUsersTableProps = {
  rows: TAdminUserRow[];
};

export function AdminUsersTable({ rows }: TAdminUsersTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const updateRole = useUpdateUserRole();
  const setBan = useSetUserBan();
  const removeUser = useDeleteUser();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((user) => {
      const matchRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchQuery =
        needle === "" ||
        [user.name, user.email, user.username, user.nomorSiswa]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(needle));
      return matchRole && matchQuery;
    });
  }, [rows, query, roleFilter]);

  const handleRoleChange = (userId: string, role: string) => {
    updateRole.mutate(
      { userId, role: role as TUpdateUserRoleInput["role"] },
      {
        onSuccess: (result) => {
          if (result.success) router.refresh();
        },
      },
    );
  };

  const handleBanToggle = (user: TAdminUserRow) => {
    setBan.mutate(
      { userId: user.id, banned: !user.banned },
      {
        onSuccess: (result) => {
          if (result.success) router.refresh();
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
        <div className="relative flex-1">
          <IconSearch
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-disabled"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="footnote">
        Menampilkan {filtered.length} dari {rows.length} user
      </p>

      <div className="rounded-[10px] border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Angkatan / Fakultas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bergabung</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <p className="body text-text-disabled">Tidak ada user cocok.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      setRoleFilter("ALL");
                    }}
                  >
                    Reset filter
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm text-text-primary">
                        {user.name ?? user.username ?? "Tanpa nama"}
                      </p>
                      <p className="footnote">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                      disabled={updateRole.isPending}
                    >
                      <SelectTrigger
                        className="h-8 w-32"
                        aria-label={`Role ${user.name ?? user.email}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-text-secondary">
                      {user.angkatan ?? "—"}
                    </p>
                    <p className="footnote">{user.fakultas ?? "—"}</p>
                  </TableCell>
                  <TableCell>
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
                    {user.banExpires ? (
                      <p className="footnote mt-1">
                        s/d {formatDateShort(user.banExpires)}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {formatDateShort(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBanToggle(user)}
                        disabled={setBan.isPending}
                      >
                        {user.banned ? (
                          <IconCircleCheck aria-hidden />
                        ) : (
                          <IconBan aria-hidden />
                        )}
                        {user.banned ? "Buka blokir" : "Blokir"}
                      </Button>
                      <AdminConfirmDelete
                        title="Hapus user ini?"
                        description="Event dan berita yang dibuat user ini ikut terhapus. Tindakan ini tidak dapat dibatalkan."
                        onConfirm={() => handleDelete(user.id)}
                        disabled={removeUser.isPending}
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
