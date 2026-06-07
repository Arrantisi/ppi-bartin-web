"use client";

import { getTickets, updateTicketStatus } from "@/server/actions/customer-service-admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCustomerServiceTickets = () => {
  return useQuery({
    queryKey: ["customerServiceTickets"],
    queryFn: () => getTickets(),
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateTicketStatus({ id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerServiceTickets"] });
    },
  });
};
