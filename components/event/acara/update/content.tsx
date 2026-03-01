import { UpdateEventField } from "@/components/field/update-event";
import { TupdateEventProps } from "@/types";

export const UpdateEventContent = ({ slug, data }: TupdateEventProps) => {
  return (
    <div className="mx-3 my-2">
      <UpdateEventField slug={slug} data={data} />
    </div>
  );
};
