import { getAllEvents } from "@/server/data/events";
import CardEvent from "@/components/cards/card-event";
import { DataKosong } from "@/components/data-kosong";

export const revalidate = 60;

export default async function PublicEventPage() {
  const events = await getAllEvents();

  if (!events || events.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Acara</h1>
          <p className="text-muted-foreground">
            Jadwal kegiatan dan acara PPI Bartin.
          </p>
        </div>
        <DataKosong href="/login" catagory="Acara" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Acara</h1>
        <p className="text-muted-foreground">
          Jadwal kegiatan dan acara PPI Bartin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <CardEvent key={event.id} {...event} hrefBase="/acara" showActions={false} />
        ))}
      </div>
    </div>
  );
}
