import { EventFormField } from "@/components/field/event-form";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

export const CreateEventContent = () => {
  return (
    <HomeLayoutComponent>
      <div className="mx-3 my-2">
        <EventFormField mode="create" />
      </div>
    </HomeLayoutComponent>
  );
};
