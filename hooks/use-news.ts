"use client";

import { getNews, getNewsBySlug } from "@/server/data/news";
import type { TgetNewsBySlug } from "@/server/data/news";
import { useQuery } from "@tanstack/react-query";

export const useNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => getNews(),
  });
};

export const useNewsBySlug = ({
  slug,
  initialData,
}: {
  slug: string;
  initialData?: TgetNewsBySlug;
}) => {
  return useQuery({
    queryKey: ["news", slug],
    queryFn: () => getNewsBySlug(slug),
    enabled: !!slug && slug !== "undefined",
    initialData,
  });
};
