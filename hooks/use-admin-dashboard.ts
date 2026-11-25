"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  deleteEvent,
  deleteNews,
  deleteUser,
  getAdminEventDetailAction,
  getAdminNewsDetailAction,
  getAdminUserDetailAction,
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
      const firstFieldError = Object.values(result.fieldErrors ?? {}).flat()[0];
      toast.error(
        firstFieldError ? `${result.error}: ${firstFieldError}` : result.error,
      );
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

function useAdminDetail<T>(
  queryKey: string,
  id: string | null,
  load: (id: string) => Promise<TServerPrompt<T | null>>,
) {
  return useQuery<T | null>({
    queryKey: ["admin", queryKey, id],
    queryFn: async () => {
      if (!id) return null;
      const result = await load(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: id !== null,
    // Detail harus selalu segar: null dari percobaan sebelumnya tidak boleh
    // bertahan saat kartu dibuka ulang.
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });
}

export const useAdminUserDetail = (userId: string | null) =>
  useAdminDetail("user-detail", userId, getAdminUserDetailAction);

export const useAdminEventDetail = (eventId: string | null) =>
  useAdminDetail("event-detail", eventId, getAdminEventDetailAction);

export const useAdminNewsDetail = (newsId: string | null) =>
  useAdminDetail("news-detail", newsId, getAdminNewsDetailAction);

