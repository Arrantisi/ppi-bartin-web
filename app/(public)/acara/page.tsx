import { getAllEvents } from "@/server/data/events";
import { safeDb } from "@/lib/db/safe";
import CardEvent from "@/components/cards/card-event";
import { DataKosong } from "@/components/data-kosong";
import { ContentPageHeader } from "@/components/shared/content-page-header";

export const revalidate = 60;

export default async function PublicEventPage() {
  const events = await safeDb(() => getAllEvents(), [], "acara list");
  const items = events.slice(0, 10);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <ContentPageHeader
        eyebrow="PPI Bartın"
        title="Acara"
        description="Jadwal kegiatan dan acara PPI Bartın."
      />

      {items.length === 0 ? (
        <DataKosong href="/login" catagory="Acara" />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((event) => (
            <CardEvent
              key={event.id}
              {...event}
              hrefBase="/acara"
              showActions={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
