import { CreateNewsField } from "@/components/field/create-news";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

export const CreateNewsContent = () => {
  return (
    <HomeLayoutComponent>
      <div className="m-3">
        <CreateNewsField />
      </div>
    </HomeLayoutComponent>
)};
