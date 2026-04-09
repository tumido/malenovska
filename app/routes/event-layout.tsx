import { Outlet } from "react-router";
import { EventShell } from "@/components/EventShell";

const EventLayout = () => {
  return (
    <EventShell>
      <Outlet />
    </EventShell>
  );
};

export default EventLayout;
