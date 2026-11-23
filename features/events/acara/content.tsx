"use client";

import { DataKosong } from "@/components/data-kosong";
import CardEvent from "@/components/cards/card-event";
import { SkeletonCardAcara } from "@/components/skeletons/card-event-skeleton";
import { useEventsPage } from "@/hooks/use-events";
import { useClientList } from "@/hooks/use-client-list";
import { ButtonCreate } from "@/components/buttons";
import { ContentPagination } from "@/components/shared/content-pagination";
import {
  ContentSearch,
  ContentSearchEmpty,
} from "@/components/shared/content-search";
import type { TgetAllEvent } from "@/server/data/events";

const getEventSearchText = (event: TgetAllEvent) =>
  `${event.judul} ${event.lokasi} ${event.slug} ${event.deskripsi} ${event.creator.name}`;

const CardAcaras = () => {
  const { data, isLoading } = useEventsPage();

  const list = useClientList({
    items: data ?? [],
    getSearchText: getEventSearchText,
    pageSize: 10,
  });

  if (isLoading) {
    return (
      <div className="mt-4 grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCardAcara key={idx} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <DataKosong href="/home/acara/create" catagory="Acara" />;
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ContentSearch
          value={list.query}
          onChange={list.setQuery}
          placeholder="Cari acara..."
          label="Cari acara"
        />
        <ButtonCreate catagory="acara" />
      </div>

      <div className="mt-4 grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.pageItems.map((event) => (
          <CardEvent {...event} key={event.id} hrefBase="/home/acara" />
        ))}
        {list.pageItems.length === 0 && (
          <ContentSearchEmpty
            query={list.query}
            label="acara"
            onReset={list.resetQuery}
          />
        )}
      </div>

      <ContentPagination
        page={list.page}
        totalPages={list.totalPages}
        onNavigate={list.setPage}
        label="Navigasi halaman acara"
      />
    </>
  );
};

export default CardAcaras;
