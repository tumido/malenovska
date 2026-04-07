"use client";

import { collection, query, where, doc, type DocumentReference, type Query } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import StatsCard from "@/components/admin/StatsCard";
import RacePieChart from "@/components/admin/RacePieChart";
import type { Config, Event, Participant, Race } from "@/lib/types";

const DashboardPage = () => {
  const [config] = useDocumentData<Config>(
    doc(db, "config", "config") as DocumentReference<Config>,
  );
  const eventId = config?.event ?? "";

  const [event] = useDocumentData<Event>(
    eventId ? doc(db, "events", eventId) as DocumentReference<Event> : null,
  );

  const [participants, participantsLoading] = useCollectionData<Participant>(
    eventId
      ? query(collection(db, "participants"), where("event", "==", eventId)) as Query<Participant>
      : null,
  );

  const [races] = useCollectionData<Race>(
    eventId
      ? query(collection(db, "races"), where("event", "==", eventId)) as Query<Race>
      : null,
  );

  const total = participants?.length ?? 0;
  const afterparty = participants?.filter((p) => p.afterparty).length ?? 0;
  const sleepover = participants?.filter((p) => p.sleepover).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Aktivní událost"
          value={event ? `${event.name} ${event.year}` : null}
          href={eventId ? `/admin/events/${eventId}` : undefined}
          loading={!config}
        />
        <StatsCard
          label="Přihlášených účastníků"
          value={total}
          href={eventId ? `/admin/participants?event=${eventId}` : undefined}
          loading={participantsLoading}
        />
        <StatsCard
          label="Afterparty"
          value={afterparty}
          loading={participantsLoading}
        />
        <StatsCard
          label="Přespání"
          value={sleepover}
          loading={participantsLoading}
        />
      </div>

      {races && participants && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Rozdělení podle stran
          </h3>
          <RacePieChart races={races} participants={participants} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
