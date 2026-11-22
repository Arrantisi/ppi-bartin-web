"use client";

import { useMemo, useState } from "react";

type TUseClientListOptions<T> = {
  items: T[];
  /** Teks yang ikut dicari. Harus fungsi stabil (module scope) agar useMemo tidak invalidate tiap render. */
  getSearchText: (item: T) => string;
  pageSize?: number;
};

const normalize = (value: string) => value.trim().toLocaleLowerCase("id-ID");

/**
 * Filter + pagination client-side untuk daftar yang sudah lengkap di React Query.
 * Query berubah → halaman otomatis kembali ke 1.
 */
export function useClientList<T>({
  items,
  getSearchText,
  pageSize = 10,
}: TUseClientListOptions<T>) {
  const [query, setQueryState] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return items;
    return items.filter((item) =>
      normalize(getSearchText(item)).includes(needle),
    );
  }, [items, query, getSearchText]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  );

  const setQuery = (value: string) => {
    setQueryState(value);
    setPage(1);
  };

  const resetQuery = () => setQuery("");

  return {
    query,
    setQuery,
    resetQuery,
    page: safePage,
    setPage,
    pageItems,
    totalItems: filtered.length,
    totalPages,
  };
}
