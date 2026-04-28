"use client";

import { DataKosong } from "@/components/data-kosong";
import CardEvent from "../../cards/card-event";
import { SkeletonCardAcara } from "../../skeletons/card-event-skeleton";
import { useEventsPage } from "@/hooks/use-events";
import { ButtonCreate } from "@/components/buttons";

const CardAcaras = () => {
  const { data, isLoading } = useEventsPage();

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
    return <DataKosong href="/home/events/create" catagory="Acara" />;
  }

  return (
    <>
      <div className="flex items-center gap-2 mt-3 ">
        {/* <InputGroup className="rounded-full py-5">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <IconSearch className="size-5" />
          </InputGroupAddon>
        </InputGroup> */}
        <div className="h-[42px] w-full bg-card rounded-full" />
        <ButtonCreate catagory="acara" />
      </div>
      <div className="mt-3 gap-6 w-full relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center">
        {data.map((data) => (
          <CardEvent {...data} key={data.id} />
        ))}
      </div>
    </>
  );
};

export default CardAcaras;
