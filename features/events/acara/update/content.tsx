import { UpdateEventField } from "@/components/field/update-event";
import { TupdateEventProps } from "@/types";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

export const UpdateEventContent = ({ slug, data }: TupdateEventProps) => {
  return (
    <HomeLayoutComponent>
      <div className="mx-3 my-2">
        <UpdateEventField slug={slug} data={data} />
      </div>
    </HomeLayoutComponent>
  );
};
