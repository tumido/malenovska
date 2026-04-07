"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import type { Event } from "@/lib/types";

interface HasEvent {
  event: string;
}

export const useEventFilter = <T extends HasEvent>(data: T[]) => {
  const searchParams = useSearchParams();
  const [eventId, setEventId] = useState(() => searchParams.get("event") ?? "");
  const [events] = useCollectionData(
    query(typedCollection<Event>("events"), orderBy("year", "desc")),
  );

  const filtered = eventId ? data.filter((d) => d.event === eventId) : data;

  const toolbar = (
    <EventFilterToolbar
      events={events ?? []}
      value={eventId}
      onChange={setEventId}
    />
  );

  return { filtered, toolbar, eventId, events: events ?? [] };
};

export const EventFilterToolbar = ({
  events,
  value,
  onChange,
}: {
  events: Event[];
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <select
      name="event-filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-gray-600 bg-neutral-800 px-3 py-1.5 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
    >
      <option value="">Všechny události</option>
      {events.map((e) => (
        <option key={e.id} value={e.id}>
          {e.name} ({e.year})
        </option>
      ))}
    </select>
  );
};
