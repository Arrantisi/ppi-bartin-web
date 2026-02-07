import LayoutEventComponent from "@/components/event/layout";

const EventLayout = ({ children }: { children: React.ReactNode }) => {
  return <LayoutEventComponent>{children}</LayoutEventComponent>;
};

export default EventLayout;
