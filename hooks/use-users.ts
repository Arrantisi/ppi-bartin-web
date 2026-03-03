"use client";

import { getUsers } from "@/server/data/users";
import { useQuery } from "@tanstack/react-query";

export const UseUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
};
