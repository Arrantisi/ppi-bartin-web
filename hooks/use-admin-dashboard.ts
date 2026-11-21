"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  deleteEvent,
  deleteNews,
  deleteUser,
  setEventEnvironment,
  setNewsEnvironment,
  setUserBan,
  updateUserRole,
} from "@/server/actions/admin-dashboard";
import type {
  TDeleteEventInput,
  TDeleteNewsInput,
  TDeleteUserInput,
  TSetEventEnvironmentInput,
  TSetNewsEnvironmentInput,
  TSetUserBanInput,
  TUpdateUserRoleInput,
} from "@/schemas/admin-dashboard";
import type { TServerPrompt } from "@/types";

function useAdminAction<TInput>(
  mutationFn: (input: TInput) => Promise<TServerPrompt<void>>,
  fallbackMessage: string,
) {
  return useMutation({
    mutationFn,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message ?? fallbackMessage);
        return;
      }
      toast.error(result.error);
    },
    onError: () => {
      toast.error("Terjadi kesalahan server");
    },
  });
}

export const useUpdateUserRole = () =>
  useAdminAction<TUpdateUserRoleInput>(updateUserRole, "Role berhasil diperbarui");

export const useSetUserBan = () =>
  useAdminAction<TSetUserBanInput>(setUserBan, "Status blokir diperbarui");

export const useDeleteUser = () =>
  useAdminAction<TDeleteUserInput>(deleteUser, "User berhasil dihapus");

export const useSetEventEnvironment = () =>
  useAdminAction<TSetEventEnvironmentInput>(
    setEventEnvironment,
    "Status event diperbarui",
  );

export const useDeleteEvent = () =>
  useAdminAction<TDeleteEventInput>(deleteEvent, "Event berhasil dihapus");

export const useSetNewsEnvironment = () =>
  useAdminAction<TSetNewsEnvironmentInput>(
    setNewsEnvironment,
    "Status berita diperbarui",
  );

export const useDeleteNews = () =>
  useAdminAction<TDeleteNewsInput>(deleteNews, "Berita berhasil dihapus");
