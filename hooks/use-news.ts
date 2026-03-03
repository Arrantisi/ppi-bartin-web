"use client";

import { getNews, getNewsBySlug } from "@/server/data/news";
import { useQuery } from "@tanstack/react-query";

export const UseNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => getNews(),
  });
};

export const UseNewsBySlug = ({ slug }: { slug: string }) => {
  return useQuery({
    queryKey: ["news", slug],
    queryFn: () => getNewsBySlug(slug),
    enabled: !!slug && slug !== "undefined",
  });
};
