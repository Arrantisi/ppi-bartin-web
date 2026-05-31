"use client";

import { useEvents } from "@/hooks/use-events";
import CardEvent from "@/components/cards/card-event";
import { SkeletonCardAcara } from "@/components/skeletons/card-event-skeleton";
import { DataKosong } from "@/components/data-kosong";

export default function PublicEventPage() {
  const { data, isLoading } = useEvents();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Acara</h1>
        <p className="text-muted-foreground">
          Jadwal kegiatan dan acara PPI Bartin. <a href="/home" className="text-primary hover:underline">Masuk</a> untuk mendaftar.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonCardAcara key={idx} />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <DataKosong href="/login" catagory="Acara" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((event) => (
            <CardEvent key={event.id} {...event} hrefBase="/acara" showActions={false} />
          ))}
        </div>
      )}
    </div>
  );
}