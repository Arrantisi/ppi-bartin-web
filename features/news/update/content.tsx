import { UpdateNewsField } from "@/components/field/update-news";
import { TupdateNewsProps } from "@/types";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

export const UpdateNewsContent = ({ slug, data }: TupdateNewsProps) => {
  return (
    <HomeLayoutComponent>
      <div className="m-3">
        <UpdateNewsField slug={slug} data={data} />
      </div>
    </HomeLayoutComponent>
  );
};
