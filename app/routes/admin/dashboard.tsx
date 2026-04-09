import { query, where, doc, type DocumentReference } from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { db, typedCollection } from "@/lib/firebase";
import StatsCard from "@/components/admin/StatsCard";
import RacePieChart from "@/components/admin/RacePieChart";
import RaceCapacityChart from "@/components/admin/RaceCapacityChart";
import RegistrationTimelineChart from "@/components/admin/RegistrationTimelineChart";
import { Pencil, Settings, Plus, ScrollText, Users, UserCheck, Image } from "lucide-react";
import { Link } from "react-router";
import type { Config, Event, Participant, Race } from "@/lib/types";

const DashboardPage = () => {
  const [config] = useDocumentData<Config>(
    doc(db, "config", "config") as DocumentReference<Config>,
  );
  const eventId = config?.event ?? "";

  const [event] = useDocumentData<Event>(
    eventId ? (doc(db, "events", eventId) as DocumentReference<Event>) : null,
  );

  const [participants, participantsLoading] = useCollectionData(
    eventId
      ? query(
          typedCollection<Participant>("participants"),
          where("event", "==", eventId),
        )
      : null,
  );

  const [races] = useCollectionData(
    eventId
      ? query(typedCollection<Race>("races"), where("event", "==", eventId))
      : null,
  );

  const total = participants?.length ?? 0;
  const afterparty = participants?.filter((p) => p.afterparty).length ?? 0;
  const sleepover = participants?.filter((p) => p.sleepover).length ?? 0;
  const capacity = races?.reduce((sum, r) => sum + (r.limit ?? 0), 0) ?? 0;

  const eventDate = event?.date
    ? typeof event.date === "object" && "toDate" in event.date
      ? (event.date as { toDate: () => Date }).toDate()
      : new Date(event.date as unknown as string)
    : null;
  const daysUntil = eventDate
    ? Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const quickActions = [
    { to: "/admin/events/new", label: "Nová událost", icon: Plus },
    { to: `/admin/legends/new${eventId ? `?event=${eventId}` : ""}`, label: "Nová legenda", icon: ScrollText },
    { to: `/admin/races/new${eventId ? `?event=${eventId}` : ""}`, label: "Nová strana", icon: Users },
    { to: `/admin/galleries/new${eventId ? `?event=${eventId}` : ""}`, label: "Nová galerie", icon: Image },
    ...(eventId ? [{ to: `/admin/participants?event=${eventId}`, label: "Účastníci", icon: UserCheck }] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary-light font-display">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          {quickActions.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 rounded-lg border border-gray-700 bg-neutral-800 px-3 py-1.5 text-sm text-primary-light transition-colors hover:border-secondary hover:text-secondary"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        <StatsCard
          label="Aktivní událost"
          value={event ? `${event.name} ${event.year}` : null}
          href={eventId ? `/admin/events/${eventId}` : undefined}
          loading={!config}
          className="col-span-2"
          actions={[
            ...(eventId ? [{ href: `/admin/events/${eventId}`, icon: <Pencil className="h-4 w-4" />, title: "Upravit událost" }] : []),
            { href: "/admin/config", icon: <Settings className="h-4 w-4" />, title: "Změnit aktivní událost" },
          ]}
        />
        <StatsCard
          label="Přihlášených účastníků"
          value={capacity > 0 ? `${total} / ${capacity}` : total}
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
        <StatsCard
          label="Registrace"
          value={event ? (event.registrationAvailable ? "Otevřena" : "Uzavřena") : null}
          loading={!config}
        />
        <StatsCard
          label="Datum akce"
          value={eventDate
            ? `${eventDate.toLocaleDateString("cs-CZ")}${daysUntil !== null && daysUntil > 0 ? ` (za ${daysUntil} dní)` : daysUntil === 0 ? " (dnes)" : ""}`
            : null}
          loading={!config}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
        {races && participants && (
          <div className="flex flex-col rounded-lg border border-gray-700 bg-neutral-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-primary-light">
              Rozdělení podle stran
            </h3>
            <div className="flex flex-1 items-center">
              <div className="w-full">
                <RacePieChart races={races} participants={participants} />
              </div>
            </div>
          </div>
        )}

        {races && participants && (
          <div className="flex flex-col rounded-lg border border-gray-700 bg-neutral-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-primary-light">
              Kapacita podle stran
            </h3>
            <div className="flex flex-1 items-center">
              <div className="w-full">
                <RaceCapacityChart races={races} participants={participants} />
              </div>
            </div>
          </div>
        )}

        {participants && (
          <div className="flex flex-col rounded-lg border border-gray-700 bg-neutral-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-primary-light">
              Registrace v čase
            </h3>
            <div className="flex flex-1 items-center">
              <div className="w-full">
                <RegistrationTimelineChart participants={participants} races={races ?? []} eventDate={eventDate} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
