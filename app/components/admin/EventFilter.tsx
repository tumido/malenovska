import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { doc, orderBy, query, type DocumentReference } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { db, typedCollection } from "@/lib/firebase";
import type { Config, Event } from "@/lib/types";

interface HasEvent {
  event: string;
}

export const useEventFilter = <T extends HasEvent>(data: T[]) => {
  const [searchParams] = useSearchParams();
  const urlEvent = searchParams.get("event");
  const [eventId, setEventId] = useState(urlEvent ?? "");
  const [events] = useCollectionData(
    query(typedCollection<Event>("events"), orderBy("year", "desc")),
  );
  const [config] = useDocumentData<Config>(
    doc(db, "config", "config") as DocumentReference<Config>,
  );

  // Default to active event from config when no URL parameter was provided
  useEffect(() => {
    if (!urlEvent && config?.event && !eventId) {
      setEventId(config.event);
    }
  }, [config?.event, urlEvent, eventId]);

  const filtered = eventId ? data.filter((d) => d.event === eventId) : data;

  const toolbar = (
    <EventFilterToolbar
      events={events ?? []}
      value={eventId}
      onChange={setEventId}
    />
  );

  const selectedEvent = (events ?? []).find((e) => e.id === eventId);
  const activeFilters = selectedEvent
    ? [{ label: `${selectedEvent.name} (${selectedEvent.year})`, onRemove: () => setEventId("") }]
    : [];

  return { filtered, toolbar, eventId, setEventId, events: events ?? [], activeFilters };
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
      className="w-full rounded border border-gray-600 bg-neutral-800 px-3 py-1.5 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary lg:w-auto"
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
