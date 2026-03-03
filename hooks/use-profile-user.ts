"use client";

import { getProfileUser } from "@/server/data/users";
import { useQuery } from "@tanstack/react-query";

export const UseProfileUser = () => {
  return useQuery({
    queryKey: ["profileUser"],
    queryFn: () => getProfileUser(),
  });
};
