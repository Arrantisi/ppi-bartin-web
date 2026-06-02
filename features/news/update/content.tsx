import { NewsFormField } from "@/components/field/news-form";
import { TupdateNewsProps } from "@/types";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

export const UpdateNewsContent = ({ slug, data }: TupdateNewsProps) => {
  return (
    <HomeLayoutComponent>
      <div className="m-3">
        <NewsFormField mode="update" slug={slug} data={data} />
      </div>
    </HomeLayoutComponent>
  );
};
