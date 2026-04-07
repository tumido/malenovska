"use client";

import { createContext, useContext } from "react";
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

export const EventProvider = ({
  children,
  event,
}: {
  children: React.ReactNode;
  event: Event;
}) => {
  return (
    <EventContext.Provider value={{ event }}>
      {children}
    </EventContext.Provider>
  );
};
