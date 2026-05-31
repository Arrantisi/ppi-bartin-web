import { UpdateNewsField } from "@/components/field/update-news";
import { TupdateNewsProps } from "@/types";

export const UpdateNewsContent = ({ slug, data }: TupdateNewsProps) => {
  return (
    <div className="m-3">
      <UpdateNewsField slug={slug} data={data} />
    </div>
  );
};
