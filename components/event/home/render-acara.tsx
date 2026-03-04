"use client";

import CardEvent from "../card";
import { SkeletonCardAcara } from "../../skeletons/card-event-skeleton";
import { useEvents } from "@/hooks/use-events";

export const RenderAcara = () => {
  const { data: events, isLoading } = useEvents();

  if (isLoading) {
    return <SkeletonCardAcara />;
  }

  if (!events || events.length === 0) {
    return <div>Event tidak ada</div>;
  }

  const data1 = events[0];
  const data2 = events[1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CardEvent {...data1} />
      <div className="hidden md:block">
        <CardEvent {...data2} />
      </div>
    </div>
  );
};
