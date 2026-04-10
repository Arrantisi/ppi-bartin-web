"use client";

import CardEvent from "../../cards/card-event";
import { SkeletonCardAcara } from "../../skeletons/card-event-skeleton";

import { useEvents } from "@/hooks/use-events";

const CardAcaras = () => {
  const { data, isLoading } = useEvents();

  if (isLoading) {
    return (
      <div className="py-2 space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <SkeletonCardAcara key={idx} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div>Event tidak ada</div>;
  }

  return (
    <div className="mt-3 gap-6 min-h-screen w-full relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-center">
      {data.map((data) => (
        <CardEvent {...data} key={data.id} />
      ))}
    </div>
  );
};

export default CardAcaras;
