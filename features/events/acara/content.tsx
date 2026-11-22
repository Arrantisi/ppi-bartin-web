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
      <div className="mt-3 gap-6 w-full grid grid-cols-1 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
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
      <div className="flex items-center gap-2 mt-3">
        <ContentSearch
          value={list.query}
          onChange={list.setQuery}
          placeholder="Cari acara..."
          label="Cari acara"
        />
        <ButtonCreate catagory="acara" />
      </div>

      <div className="mt-3 gap-6 w-full relative grid grid-cols-1 md:grid-cols-2 justify-center">
        {list.pageItems.map((event) => (
          <CardEvent {...event} key={event.id} />
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
