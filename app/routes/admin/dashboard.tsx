import { useState } from "react";
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
import {
  Pencil,
  Settings,
  Plus,
  ScrollText,
  Users,
  Image,
  Download,
  ExternalLink,
  X,
} from "lucide-react";
import { exportParticipantsCsv } from "@/lib/export-csv";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router";
import type {
  Config,
  Event,
  Gallery,
  Legend,
  Participant,
  Race,
  UserRole,
} from "@/lib/types";

const relativeTime = (date: Date): string => {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "právě teď";
  if (diff < 3600) return `před ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `před ${Math.floor(diff / 3600)} hod`;
  return `před ${Math.floor(diff / 86400)} dny`;
};

const DashboardPage = () => {
  const { role } = useAuth();
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

  const [legends] = useCollectionData(
    eventId
      ? query(typedCollection<Legend>("legends"), where("event", "==", eventId))
      : null,
  );

  const [galleries] = useCollectionData(
    eventId
      ? query(
          typedCollection<Gallery>("galleries"),
          where("event", "==", eventId),
        )
      : null,
  );

  const total = participants?.length ?? 0;
  const capacity = races?.reduce((sum, r) => sum + (r.limit ?? 0), 0) ?? 0;

  const checkboxExtras =
    event?.registrationExtras?.filter(
      (e) => e.type === "checkbox" && e.props?.id,
    ) ?? [];

  const eventDate = event?.date
    ? typeof event.date === "object" && "toDate" in event.date
      ? (event.date as { toDate: () => Date }).toDate()
      : new Date(event.date as unknown as string)
    : null;
  const daysUntil = eventDate
    ? Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const fieldExtras =
    event?.registrationExtras?.filter(
      (e) =>
        (e.type === "checkbox" || e.type === "text" || e.type === "number") &&
        e.props?.id,
    ) ?? [];

  const handleExport = () => {
    if (!participants || !races) return;
    exportParticipantsCsv(participants, races, fieldExtras);
  };

  const quickActions: Array<{
    to: string;
    label: string;
    icon: typeof Plus;
    roles?: UserRole[];
  }> = [
    {
      to: "/admin/events/new",
      label: "Nová událost",
      icon: Plus,
      roles: ["admin"],
    },
    {
      to: `/admin/legends/new${eventId ? `?event=${eventId}` : ""}`,
      label: "Nová legenda",
      icon: ScrollText,
      roles: ["admin", "writer"],
    },
    {
      to: `/admin/races/new${eventId ? `?event=${eventId}` : ""}`,
      label: "Nová strana",
      icon: Users,
      roles: ["admin"],
    },
    {
      to: `/admin/galleries/new${eventId ? `?event=${eventId}` : ""}`,
      label: "Nová galerie",
      icon: Image,
      roles: ["admin"],
    },
  ];

  const filteredActions = quickActions.filter(
    (a) => !a.roles || (role && a.roles.includes(role)),
  );
  const canExport = role === "admin" || role === "staff";
  const canSeeParticipants = role === "admin" || role === "staff";
  const canSeeContent = role === "admin" || role === "writer";

  const [fabOpen, setFabOpen] = useState(false);

  const fabActions = [
    ...filteredActions.map((a) => ({
      type: "link" as const,
      to: a.to,
      label: a.label,
      icon: a.icon,
    })),
    ...(canExport && eventId && participants
      ? [
          {
            type: "button" as const,
            label: "Export registrace",
            icon: Download,
            onClick: handleExport,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="hidden sm:flex sm:flex-wrap sm:gap-2">
          {filteredActions.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 rounded-lg border border-gray-700 bg-neutral-800 px-3 py-1.5 text-sm text-primary-light transition-colors hover:border-secondary hover:text-secondary"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          {canExport && eventId && participants && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg border border-gray-700 bg-neutral-800 px-3 py-1.5 text-sm text-primary-light transition-colors hover:border-secondary hover:text-secondary cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export registrace
            </button>
          )}
        </div>
      </div>

      {/* Mobile FAB */}
      {fabActions.length > 0 && (
        <div className="fixed bottom-16 right-4 z-50 sm:hidden">
          {fabOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/40"
                onClick={() => setFabOpen(false)}
              />
              <div className="relative z-50 mb-3 flex flex-col items-end gap-2">
                {fabActions.map((action) => {
                  const Icon = action.icon;
                  const className =
                    "flex items-center gap-3 rounded-full bg-neutral-800 border border-gray-700 pl-4 pr-3 py-2.5 text-sm text-primary-light shadow-lg transition-colors active:bg-neutral-700";
                  return action.type === "link" ? (
                    <Link
                      key={action.label}
                      to={action.to!}
                      onClick={() => setFabOpen(false)}
                      className={className}
                    >
                      {action.label}
                      <Icon className="h-5 w-5" />
                    </Link>
                  ) : (
                    <button
                      key={action.label}
                      onClick={() => {
                        action.onClick?.();
                        setFabOpen(false);
                      }}
                      className={`${className} cursor-pointer`}
                    >
                      {action.label}
                      <Icon className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </>
          )}
          <button
            onClick={() => setFabOpen((v) => !v)}
            className={`ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary shadow-lg transition-transform cursor-pointer active:scale-95 ${fabOpen ? "rotate-0" : ""}`}
          >
            {fabOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Plus className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatsCard
          label="Aktivní událost"
          value={event ? `${event.name} ${event.year}` : null}
          href={
            role === "admin" && eventId ? `/admin/events/${eventId}` : undefined
          }
          loading={!config}
          className="col-span-2"
          actions={
            role === "admin"
              ? [
                  ...(eventId
                    ? [
                        {
                          href: `/admin/events/${eventId}`,
                          icon: <Pencil className="h-4 w-4" />,
                          title: "Upravit událost",
                        },
                      ]
                    : []),
                  {
                    href: "/admin/config",
                    icon: <Settings className="h-4 w-4" />,
                    title: "Změnit aktivní událost",
                  },
                ]
              : []
          }
        />
        <StatsCard
          label="Přihlášeno"
          value={capacity > 0 ? `${total} / ${capacity}` : total}
          href={
            canSeeParticipants && eventId
              ? `/admin/participants?event=${eventId}`
              : undefined
          }
          loading={participantsLoading}
        />
        <StatsCard
          label="Registrace"
          value={
            event
              ? event.registrationAvailable
                ? "Otevřena"
                : "Uzavřena"
              : null
          }
          loading={!config}
        />
        <StatsCard
          label="Datum akce"
          value={
            eventDate
              ? `${eventDate.toLocaleDateString("cs-CZ")}${daysUntil !== null && daysUntil > 0 ? ` (za ${daysUntil} dní)` : daysUntil === 0 ? " (dnes)" : ""}`
              : null
          }
          loading={!config}
        />
        {eventId && (
          <div className="flex flex-col justify-center gap-2 p-2">
            <a
              href={`/${eventId}`}
              target="_blank"
              rel="external"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-secondary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Zobrazit na webu
            </a>
            {event?.contact?.facebook && (
              <a
                href={event.contact.facebook}
                target="_blank"
                rel="external"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-secondary"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Facebook událost
              </a>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {checkboxExtras.length > 0 && (
          <div className="col-span-2 flex flex-col rounded-lg border border-gray-700 bg-neutral-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-primary-light">
              Dodatečné údaje
            </h3>
            {participantsLoading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-gray-700" />
            ) : (
              <div className="space-y-2">
                {checkboxExtras.map((extra) => {
                  const content = (
                    <>
                      <span className="text-sm text-gray-400">
                        {extra.props!.label ?? extra.props!.id!}
                      </span>
                      <span className="text-lg font-bold text-primary-light">
                        {participants?.filter(
                          (p) => p[extra.props!.id!] === true,
                        ).length ?? 0}
                      </span>
                    </>
                  );
                  return canSeeParticipants ? (
                    <Link
                      key={extra.props!.id}
                      to={`/admin/participants?event=${eventId}&field=${extra.props!.id}`}
                      className="flex items-center justify-between rounded px-2 py-1 -mx-2 transition-colors hover:bg-white/5"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div
                      key={extra.props!.id}
                      className="flex items-center justify-between px-2 py-1 -mx-2"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div className="col-span-2 flex flex-col rounded-lg border border-gray-700 bg-neutral-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-primary-light">
            Obsah na webu
          </h3>
          {!config ? (
            <div className="h-8 w-16 animate-pulse rounded bg-gray-700" />
          ) : (
            <div className="space-y-2">
              {canSeeContent ? (
                <Link
                  to={`/admin/legends?event=${eventId}`}
                  className="flex items-center justify-between rounded px-2 py-1 -mx-2 transition-colors hover:bg-white/5"
                >
                  <span className="text-sm text-gray-400">Legendy</span>
                  <span className="text-lg font-bold text-primary-light">
                    {legends?.length ?? 0}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center justify-between px-2 py-1 -mx-2">
                  <span className="text-sm text-gray-400">Legendy</span>
                  <span className="text-lg font-bold text-primary-light">
                    {legends?.length ?? 0}
                  </span>
                </div>
              )}
              {role === "admin" ? (
                <Link
                  to={`/admin/galleries?event=${eventId}`}
                  className="flex items-center justify-between rounded px-2 py-1 -mx-2 transition-colors hover:bg-white/5"
                >
                  <span className="text-sm text-gray-400">Galerie</span>
                  <span className="text-lg font-bold text-primary-light">
                    {galleries?.length ?? 0}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center justify-between px-2 py-1 -mx-2">
                  <span className="text-sm text-gray-400">Galerie</span>
                  <span className="text-lg font-bold text-primary-light">
                    {galleries?.length ?? 0}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        {participants && participants.length > 0 && (
          <div className="col-span-2 flex flex-col rounded-lg border border-gray-700 bg-neutral-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-primary-light">
              Nejnovější registrace
            </h3>
            <div className="space-y-2">
              {[...participants]
                .sort((a, b) => {
                  const aTime = a.createdate
                    ? (a.createdate as { toDate: () => Date })
                        .toDate()
                        .getTime()
                    : 0;
                  const bTime = b.createdate
                    ? (b.createdate as { toDate: () => Date })
                        .toDate()
                        .getTime()
                    : 0;
                  return bTime - aTime;
                })
                .slice(0, 5)
                .map((p) => {
                  const content = (
                    <>
                      <span className="text-sm text-primary-light">
                        {p.nickName
                          ? `${p.firstName} „${p.nickName}" ${p.lastName}`
                          : `${p.firstName} ${p.lastName}`}
                      </span>
                      <span className="text-xs text-gray-500">
                        {p.createdate
                          ? relativeTime(
                              (p.createdate as { toDate: () => Date }).toDate(),
                            )
                          : ""}
                      </span>
                    </>
                  );
                  return canSeeParticipants ? (
                    <Link
                      key={p.id}
                      to={`/admin/participants/${p.id}`}
                      className="flex items-center justify-between rounded px-2 py-1 -mx-2 transition-colors hover:bg-white/5"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div
                      key={p.id}
                      className="flex items-center justify-between px-2 py-1 -mx-2"
                    >
                      {content}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
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
                <RegistrationTimelineChart
                  participants={participants}
                  races={races ?? []}
                  eventDate={eventDate}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {participants &&
        races &&
        participants.length > 0 &&
        (() => {
          const raceMap = new Map(races.map((r) => [r.id, r]));
          // Normalize groups: trim + case-insensitive, display the most common variant
          const normalizedMap = new Map<
            string,
            { variants: Map<string, number>; members: Participant[] }
          >();
          for (const p of participants) {
            const raw = ((p.group as string) ?? "").trim();
            if (!raw) continue;
            const key = raw.toLowerCase();
            const entry = normalizedMap.get(key) ?? {
              variants: new Map<string, number>(),
              members: [] as Participant[],
            };
            entry.variants.set(raw, (entry.variants.get(raw) ?? 0) + 1);
            entry.members.push(p);
            normalizedMap.set(key, entry);
          }
          if (normalizedMap.size === 0) return null;
          const sorted = [...normalizedMap.values()]
            .map(({ variants, members }) => {
              // Pick the most frequently used spelling as display name
              const displayName = [...variants.entries()].sort(
                (a, b) => b[1] - a[1],
              )[0][0];
              return [displayName, members] as [string, Participant[]];
            })
            .sort((a, b) => b[1].length - a[1].length);
          return (
            <div className="flex flex-col rounded-lg border border-gray-700 bg-neutral-800 p-6">
              <h3 className="mb-4 text-lg font-semibold text-primary-light">
                Skupiny
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.slice(0, 9).map(([name, members]) => {
                  const byRace = new Map<string, Participant[]>();
                  for (const m of members) {
                    byRace.set(m.race, [...(byRace.get(m.race) ?? []), m]);
                  }
                  const cardContent = (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-400">
                          {name}
                        </span>
                        <span className="text-sm text-gray-400">
                          <span className="text-lg font-bold text-primary-light">
                            {members.length}
                          </span>{" "}
                          {members.length === 1
                            ? "účastník"
                            : members.length >= 2 && members.length <= 4
                              ? "účastníci"
                              : "účastníků"}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {[...byRace.entries()].map(([raceId, raceMembers]) => {
                          const race = raceMap.get(raceId);
                          return (
                            <div
                              key={raceId}
                              className="flex items-start gap-2"
                            >
                              <span
                                className="mt-1.5 inline-block h-2 w-2 rounded-full shrink-0"
                                style={{
                                  backgroundColor: race?.color ?? "#9e9e9e",
                                }}
                              />
                              <span className="text-sm text-primary-light">
                                {raceMembers
                                  .map((m) => m.nickName || m.firstName)
                                  .join(", ")}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                  return canSeeParticipants ? (
                    <Link
                      key={name}
                      to={`/admin/participants?event=${eventId}&group=${encodeURIComponent(name)}`}
                      className="rounded-lg border border-gray-700 p-4 transition-colors hover:border-gray-600 hover:bg-white/5"
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div
                      key={name}
                      className="rounded-lg border border-gray-700 p-4"
                    >
                      {cardContent}
                    </div>
                  );
                })}
              </div>
              {canSeeParticipants && sorted.length > 9 && (
                <Link
                  to={`/admin/participants?event=${eventId}`}
                  className="mt-4 block text-center text-xs text-gray-500 transition-colors hover:text-secondary"
                >
                  a {sorted.length - 9} dalších…
                </Link>
              )}
            </div>
          );
        })()}
    </div>
  );
};

export default DashboardPage;
