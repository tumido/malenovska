import { useState, useCallback, useMemo } from "react";
import { Link, useParams } from "react-router";
import { query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { PageHero } from "@/components/PageHero";
import { Markdown } from "@/components/Markdown";
import { stableSort, getSorting } from "@/lib/sorting";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Users,
} from "lucide-react";
import type { Participant, Race } from "@/lib/types";

type RowData = {
  race: string;
  raceColor: string;
  nickName: string;
  firstName: string;
  lastName: string;
  group: string;
};

const headers = [
  { id: "race", label: "Strana" },
  { id: "nickName", label: "Přezdívka" },
  { id: "firstName", label: "Jméno" },
  { id: "lastName", label: "Příjmení" },
  { id: "group", label: "Skupina" },
] as const;

const headerKeys = headers.map((h) => h.id);

const filterBySearch = (row: RowData, filter: string): boolean => {
  if (!filter) return true;
  return headerKeys.some((k) => row[k]?.toLowerCase().includes(filter));
};

const PAGE_SIZE = 25;

const AttendeesPage = () => {
  const { eventId } = useParams();
  const event = useEvent();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("race");
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [raceFilter, setRaceFilter] = useState<string | null>(null);

  const [participants, pLoading] = useCollectionData(
    query(
      typedCollection<Participant>("participants"),
      where("event", "==", event.id),
    ),
  );
  const [races, rLoading] = useCollectionData(
    query(typedCollection<Race>("races"), where("event", "==", event.id)),
  );

  const handleSort = useCallback(
    (property: string) => {
      setOrder((prev) =>
        orderBy === property && prev === "asc" ? "desc" : "asc",
      );
      setOrderBy(property);
    },
    [orderBy],
  );

  const handleSearch = useCallback((value: string) => {
    setSearch(value.toLowerCase());
    setPage(0);
  }, []);

  const handleRaceFilter = useCallback(
    (raceId: string) => {
      setRaceFilter((prev) => (prev === raceId ? null : raceId));
      setPage(0);
    },
    [],
  );

  // Race mapping and counts
  const { raceMapping, raceCounts, raceColors } = useMemo(() => {
    if (!races || !participants)
      return { raceMapping: {}, raceCounts: {}, raceColors: {} };
    const mapping: Record<string, string> = {};
    const colors: Record<string, string> = {};
    races.forEach((r) => {
      mapping[r.id] = r.name;
      colors[r.id] = r.color;
    });
    const counts: Record<string, number> = {};
    participants.forEach((p) => {
      counts[p.race] = (counts[p.race] || 0) + 1;
    });
    return { raceMapping: mapping, raceCounts: counts, raceColors: colors };
  }, [races, participants]);

  if (pLoading || rLoading || !participants || !races) {
    return (
      <>
        <PageHero title="Účastníci" compact />
        <div className="-mx-4 min-h-screen bg-black/80 px-4 pt-8">
          <div className="mx-auto max-w-6xl">
            {/* Skeleton race cards */}
            <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 w-36 shrink-0 animate-pulse rounded-lg bg-white/5"
                />
              ))}
            </div>
            {/* Skeleton search bar */}
            <div className="mb-4 h-12 animate-pulse rounded-lg bg-white/5" />
            {/* Skeleton rows */}
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-lg bg-white/5"
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  const rows: RowData[] = participants
    .map((p) => ({
      race: raceMapping[p.race] ?? p.race,
      raceColor: raceColors[p.race] ?? "#666",
      nickName: p.nickName ?? "",
      firstName: p.firstName,
      lastName: p.lastName,
      group: p.group ?? "",
    }))
    .filter((p) => filterBySearch(p, search))
    .filter(
      (p) =>
        !raceFilter || p.race === (raceMapping[raceFilter] ?? raceFilter),
    );

  const sorted = stableSort(
    rows,
    getSorting<RowData>(order, orderBy as keyof RowData),
  );
  const paged = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

  return (
    <>
      <PageHero title="Účastníci" compact />
      <div className="-mx-4 min-h-screen bg-black/80 px-4 pt-8 pb-12">
        <div className="mx-auto max-w-6xl">
          {/* Optional markdown intro */}
          {event.registrationList && (
            <div className="mx-auto mb-8 max-w-3xl text-primary-light/80">
              <Markdown content={event.registrationList} />
            </div>
          )}

          {/* Race summary cards */}
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
            {races
              .slice()
              .sort((a, b) => a.priority - b.priority)
              .map((race) => {
                const count = raceCounts[race.id] || 0;
                const isActive = raceFilter === race.id;
                return (
                  <button
                    key={race.id}
                    onClick={() => handleRaceFilter(race.id)}
                    className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                      isActive
                        ? "bg-white/15 ring-2 ring-secondary shadow-lg"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span
                      className="block h-3 w-3 shrink-0 rounded-full shadow-sm"
                      style={{ backgroundColor: race.color }}
                    />
                    <div className="text-left">
                      <div className="text-sm font-medium text-primary-light">
                        {race.name}
                      </div>
                      <div className="text-xs text-grey-400">
                        {count} / {race.limit}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Search bar + count */}
          <div className="mb-4 flex items-center gap-4 rounded-lg bg-white/5 px-4 py-3 backdrop-blur-sm">
            <Search size={18} className="shrink-0 text-grey-400" />
            <input
              type="text"
              placeholder="Hledat účastníka…"
              aria-label="Hledat účastníka"
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder-grey-400 focus:outline-none"
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  (e.target as HTMLInputElement).value = "";
                  handleSearch("");
                }
              }}
            />
            <span className="shrink-0 text-sm text-grey-400">
              {rows.length}{" "}
              {rows.length === 1
                ? "účastník"
                : rows.length < 5
                  ? "účastníci"
                  : "účastníků"}
            </span>
          </div>

          {/* Participant list */}
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-grey-400">
              <Users size={48} className="mb-4 opacity-50" />
              {search || raceFilter ? (
                <p className="text-lg">Žádní účastníci nenalezeni</p>
              ) : (
                <>
                  <p className="mb-2 text-lg">Zatím se nikdo nezaregistroval</p>
                  <Link
                    to={`/${eventId}/signup`}
                    className="text-secondary hover:text-secondary-dark transition-colors"
                  >
                    Buď první!
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Table header row */}
              <div className="mb-2 hidden items-center gap-2 px-4 text-xs font-bold uppercase tracking-wider text-grey-500 md:flex">
                {headers.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleSort(h.id)}
                    className={`flex items-center gap-1 transition-colors hover:text-grey-400 ${
                      h.id === "race" ? "w-48" : "flex-1"
                    }`}
                  >
                    {h.label}
                    {orderBy === h.id ? (
                      order === "desc" ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronUp size={14} />
                      )
                    ) : (
                      <ChevronsUpDown size={12} className="opacity-40" />
                    )}
                  </button>
                ))}
              </div>

              {/* Rows */}
              <div className="space-y-1">
                {paged.map((row, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-white/5 px-4 py-3 transition-colors hover:bg-white/10 md:flex md:items-center md:gap-2"
                  >
                    {/* Race with color dot */}
                    <div className="mb-1 flex w-48 shrink-0 items-center gap-2 md:mb-0">
                      <span
                        className="block h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: row.raceColor }}
                      />
                      <span className="text-sm text-grey-400">{row.race}</span>
                    </div>
                    {/* Mobile: nickname + name on one line */}
                    <div className="flex items-baseline gap-2 md:contents">
                      <div className="text-sm font-medium text-primary-light md:flex-1">
                        {row.nickName || (
                          <span className="text-grey-500">—</span>
                        )}
                      </div>
                      <div className="text-sm text-primary-light/80 md:flex-1">
                        {row.firstName}
                      </div>
                      <div className="text-sm text-primary-light/80 md:flex-1">
                        {row.lastName}
                      </div>
                    </div>
                    {/* Group */}
                    <div className="mt-1 text-xs text-grey-500 md:mt-0 md:flex-1 md:text-sm md:text-grey-400">
                      {row.group || <span className="text-grey-500">—</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="rounded-lg bg-white/5 px-4 py-2 text-sm text-primary-light transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5"
                  >
                    Předchozí
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`h-8 w-8 rounded-lg text-sm transition-colors ${
                          page === i
                            ? "bg-secondary text-white"
                            : "bg-white/5 text-grey-400 hover:bg-white/10"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page >= totalPages - 1}
                    className="rounded-lg bg-white/5 px-4 py-2 text-sm text-primary-light transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5"
                  >
                    Další
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendeesPage;
