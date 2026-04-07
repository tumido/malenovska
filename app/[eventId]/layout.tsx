import { EventShell } from "@/components/EventShell";

export const generateStaticParams = () => {
  return [{ eventId: "_" }];
};

const EventLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <EventShell>{children}</EventShell>;
};

export default EventLayout;
