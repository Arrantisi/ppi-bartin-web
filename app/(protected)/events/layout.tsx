import NavMainEvent from "@/components/event/nav-event";

const EventLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavMainEvent />
      {children}
    </div>
  );
};

export default EventLayout;
