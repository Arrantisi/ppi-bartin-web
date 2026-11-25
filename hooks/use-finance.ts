"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createFinanceTransaction,
  deleteFinanceTransaction,
  updateFinanceTransaction,
} from "@/server/actions/finance";
import type { TFinanceSnapshot } from "@/types/finance";

const fetchFinanceSnapshot = async (): Promise<TFinanceSnapshot> => {
  const response = await fetch("/api/finance", { credentials: "same-origin" });
  if (!response.ok) {
    throw new Error("Gagal memuat data keuangan");
  }
  return (await response.json()) as TFinanceSnapshot;
};

export function useFinance() {
  return useQuery({
    queryKey: ["finance"],
    queryFn: fetchFinanceSnapshot,
    staleTime: 30_000,
    refetchInterval: (query) =>
      query.state.data?.kpiSource === "dummy" ? false : 5_000,
    refetchIntervalInBackground: false,
    placeholderData: keepPreviousData,
  });
}

export function useCreateFinanceTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFinanceTransaction,
    onSuccess: (result) => {
      if (result.success) {
        void queryClient.invalidateQueries({ queryKey: ["finance"] });
      }
    },
  });
}

export function useUpdateFinanceTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFinanceTransaction,
    onSuccess: (result) => {
      if (result.success) {
        void queryClient.invalidateQueries({ queryKey: ["finance"] });
      }
    },
  });
}

export function useDeleteFinanceTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFinanceTransaction,
    onSuccess: (result) => {
      if (result.success) {
        void queryClient.invalidateQueries({ queryKey: ["finance"] });
      }
    },
  });
}
