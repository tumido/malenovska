"use client";

import { useState } from "react";
import { collection, orderBy, query, type Query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import type { Event } from "@/lib/types";

interface HasEvent {
  event: string;
}

export function useEventFilter<T extends HasEvent>(data: T[]) {
  const [eventId, setEventId] = useState("");
  const [events] = useCollectionData<Event>(
    query(collection(db, "events"), orderBy("year", "desc")) as Query<Event>,
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
}

export function EventFilterToolbar({
  events,
  value,
  onChange,
}: {
  events: Event[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
    >
      <option value="">Všechny události</option>
      {events.map((e) => (
        <option key={e.id} value={e.id}>
          {e.name} ({e.year})
        </option>
      ))}
    </select>
  );
}
