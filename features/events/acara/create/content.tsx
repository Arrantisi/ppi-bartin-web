import { CreateEventField } from "@/components/field/create-event";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

export const CreateEventContent = () => {
  return (
    <HomeLayoutComponent>
      <div className="mx-3 my-2">
        <CreateEventField />
      </div>
    </HomeLayoutComponent>
  );
};
