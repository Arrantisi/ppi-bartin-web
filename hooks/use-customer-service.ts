"use client";

import {
  getTickets,
  updateTicketStatus,
  deleteTicket,
} from "@/server/actions/customer-service-admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTicket(id),
    onSuccess: (data) => {
      if (data.status === "error") {
        toast.error(data.msg);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["customerServiceTickets"] });
    },
    onError: () => {
      toast.error("Gagal menghapus tiket, coba lagi");
    },
  });
};
