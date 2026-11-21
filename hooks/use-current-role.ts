"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUserRole } from "@/server/actions/account";

export function useCurrentUserRole() {
  return useQuery({
    queryKey: ["currentUserRole"],
    queryFn: () => getCurrentUserRole(),
    staleTime: 5 * 60 * 1000,
  });
}
