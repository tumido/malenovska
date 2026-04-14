import { useMemo } from "react";
import type { Event } from "@/lib/types";

export const usePastEvents = (allEvents: Event[] | undefined, currentEvent: Event): Event[] => {
  return useMemo(() => {
    if (!allEvents) return [];
    const now = new Date();
    return allEvents
      .filter((e) => e.id !== currentEvent.id && e.type === currentEvent.type && e.date?.toDate() <= now)
      .sort((a, b) => (a.date > b.date ? -1 : 1));
  }, [allEvents, currentEvent.id, currentEvent.type]);
};
