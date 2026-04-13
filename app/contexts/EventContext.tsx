
import { createContext, useContext, useMemo } from "react";
import type { Event } from "@/lib/types";

type EventContextType = {
  event: Event;
};

const EventContext = createContext<EventContextType | null>(null);

export const useEvent = (): Event => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvent must be used within EventProvider");
  return ctx.event;
};

export const useOptionalEvent = (): Event | null => {
  const ctx = useContext(EventContext);
  return ctx?.event ?? null;
};

export const EventProvider = ({
  children,
  event,
}: {
  children: React.ReactNode;
  event: Event;
}) => {
  const value = useMemo(() => ({ event }), [event]);

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};
