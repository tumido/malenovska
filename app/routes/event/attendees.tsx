import { useState, useCallback, useMemo } from "react";
import { Link, useParams } from "react-router";
import { query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { PageHero } from "@/components/PageHero";
import { Loading } from "@/components/Loading";
import { Markdown } from "@/components/Markdown";
import { getSorting } from "@/lib/sorting";
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

  const handleRaceFilter = useCallback((raceId: string) => {
    setRaceFilter((prev) => (prev === raceId ? null : raceId));
    setPage(0);
  }, []);

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
        <section className="-mx-4 min-h-screen bg-primary-light text-primary">
          <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
            <Loading />
          </div>
        </section>
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
      (p) => !raceFilter || p.race === (raceMapping[raceFilter] ?? raceFilter),
    );

  const sorted = [...rows].sort(
    getSorting<RowData>(order, orderBy as keyof RowData),
  );
  const paged = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

  return (
    <>
      <PageHero title="Účastníci" compact />

      <section className="-mx-4 min-h-screen bg-primary-light text-primary">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
          {/* Optional markdown intro */}
          {event.registrationList && (
            <div className="mx-auto mb-8 max-w-3xl">
              <Markdown content={event.registrationList} />
            </div>
          )}

          {/* Race summary cards */}
          <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
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
                    className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                      isActive
                        ? "border-secondary bg-secondary/5 shadow-md"
                        : "border-primary/10 hover:border-primary/20 hover:bg-primary/5"
                    }`}
                  >
                    <span
                      className="block h-3 w-3 shrink-0 rounded-full shadow-sm"
                      style={{ backgroundColor: race.color }}
                    />
                    <div className="text-left">
                      <div className="text-sm font-medium">{race.name}</div>
                      <div className="text-xs text-primary/50">
                        {count} / {race.limit}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Search bar + count */}
          <div className="mb-6 flex items-center gap-4 rounded-lg border border-primary/10 px-4 py-3">
            <Search size={18} className="shrink-0 text-primary/40" />
            <input
              type="text"
              placeholder="Hledat účastníka…"
              aria-label="Hledat účastníka"
              className="min-w-0 flex-1 bg-transparent text-sm text-primary placeholder-primary/40 focus:outline-none"
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  (e.target as HTMLInputElement).value = "";
                  handleSearch("");
                }
              }}
            />
            <span className="shrink-0 text-sm text-primary/50">
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
            <div className="flex flex-col items-center justify-center py-20 text-primary/40">
              <Users size={48} className="mb-4 opacity-50" />
              {search || raceFilter ? (
                <p className="text-lg">Žádní účastníci nenalezeni</p>
              ) : (
                <>
                  <p className="mb-2 text-lg">Zatím se nikdo nezaregistroval</p>
                  <Link
                    to={`/${eventId}/signup`}
                    className="text-secondary transition-colors hover:text-secondary-dark"
                  >
                    Buď první!
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Table header row */}
              <div className="mb-1 hidden items-center gap-2 border-b border-primary/10 px-4 pb-2 text-xs font-bold uppercase tracking-wider text-primary/40 md:flex">
                {headers.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleSort(h.id)}
                    className={`flex items-center gap-1 transition-colors hover:text-primary/70 ${
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
              <div>
                {paged.map((row, i) => (
                  <div
                    key={i}
                    className="border-b border-primary/5 px-4 py-3 text-center transition-colors hover:bg-primary/5 md:flex md:items-center md:gap-2 md:text-left"
                  >
                    {/* Race with color dot — hidden on mobile, shown in desktop column */}
                    <div className="hidden w-48 shrink-0 items-center gap-2 md:flex">
                      <span
                        className="block h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: row.raceColor }}
                      />
                      <span className="text-sm text-primary/60">
                        {row.race}
                      </span>
                    </div>
                    {/* Mobile: nickname bold, name in parentheses */}
                    <div className="text-sm md:hidden">
                      {row.nickName ? (
                        <>
                          <span className="font-bold">{row.nickName}</span>{" "}
                          <span className="text-primary/50">
                            ({row.firstName} {row.lastName})
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">
                          {row.firstName} {row.lastName}
                        </span>
                      )}
                    </div>
                    {/* Desktop: three columns */}
                    <div className="hidden text-sm font-bold md:block md:flex-1">
                      {row.nickName}
                    </div>
                    <div className="hidden text-sm text-primary/80 md:block md:flex-1">
                      {row.firstName}
                    </div>
                    <div className="hidden text-sm text-primary/80 md:block md:flex-1">
                      {row.lastName}
                    </div>
                    {/* Mobile: race + group on one line below name */}
                    <div className="mt-1 flex items-center justify-center gap-3 text-xs text-primary/40 md:hidden">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="block h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: row.raceColor }}
                        />
                        {row.race}
                      </span>
                      {row.group && (
                        <>
                          <span className="text-primary/20">|</span>
                          <span>{row.group}</span>
                        </>
                      )}
                    </div>
                    {/* Desktop: group column */}
                    <div className="hidden md:block md:flex-1 md:text-sm md:text-primary/40">
                      {row.group || (
                        <span className="text-primary/30">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="cursor-pointer rounded-lg border border-primary/10 px-4 py-2 text-sm transition-colors hover:bg-primary/5 disabled:cursor-default disabled:opacity-30"
                  >
                    Předchozí
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`h-8 w-8 cursor-pointer rounded-lg text-sm transition-colors ${
                          page === i
                            ? "bg-secondary text-white"
                            : "text-primary/50 hover:bg-primary/5"
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
                    className="cursor-pointer rounded-lg border border-primary/10 px-4 py-2 text-sm transition-colors hover:bg-primary/5 disabled:cursor-default disabled:opacity-30"
                  >
                    Další
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default AttendeesPage;
