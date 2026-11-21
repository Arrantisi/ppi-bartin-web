import { NewsFormField } from "@/components/field/news-form";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

export const CreateNewsContent = () => {
  return (
    <HomeLayoutComponent>
      <div className="m-3">
        <NewsFormField mode="create" />
      </div>
    </HomeLayoutComponent>
)};
