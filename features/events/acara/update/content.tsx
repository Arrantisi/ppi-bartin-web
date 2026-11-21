import { EventFormField } from "@/components/field/event-form";
import { TupdateEventProps } from "@/types";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

export const UpdateEventContent = ({ slug, data }: TupdateEventProps) => {
  return (
    <HomeLayoutComponent>
      <div className="mx-3 my-2">
        <EventFormField mode="update" slug={slug} data={data} />
      </div>
    </HomeLayoutComponent>
  );
};
