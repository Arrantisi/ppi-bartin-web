"use client";

import { getProfileUser, getUsers } from "@/server/data/users";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
};

export const useProfileUser = () => {
  return useQuery({
    queryKey: ["profileUser"],
    queryFn: () => getProfileUser(),
  });
};
