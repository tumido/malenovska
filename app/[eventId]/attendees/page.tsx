"use client";

import { useState, useCallback } from "react";
import { collection, query, where, Query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { Banner } from "@/components/Banner";
import { Article } from "@/components/Article";
import { Markdown } from "@/components/Markdown";
import { SortableTableHead, type TableHeader } from "@/components/SortableTableHead";
import { TableToolbar } from "@/components/TableToolbar";
import { stableSort, getSorting } from "@/lib/sorting";
import type { Participant, Race } from "@/lib/types";

const headers: TableHeader[] = [
  { id: "race", label: "Strana" },
  { id: "nickName", label: "Přezdívka" },
  { id: "firstName", label: "Jméno" },
  { id: "lastName", label: "Příjmení" },
  { id: "group", label: "Skupina" },
];
const headerKeys = headers.map((h) => h.id);

type RowData = Record<string, string>;

function filterBySearch(row: RowData, filter: string): boolean {
  if (!filter) return true;
  return Object.entries(row).some(
    ([k, v]) => headerKeys.includes(k) && v?.toLowerCase().includes(filter)
  );
}

export default function AttendeesPage() {
  const event = useEvent();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("race");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(25);
  const [search, setSearch] = useState("");

  const [participants, pLoading] = useCollectionData<Participant>(
    query(collection(db, "participants"), where("event", "==", event.id)) as Query<Participant>
  );
  const [races, rLoading] = useCollectionData<Race>(
    query(collection(db, "races"), where("event", "==", event.id)) as Query<Race>
  );

  const handleSort = useCallback((property: string) => {
    setOrder((prev) => (orderBy === property && prev === "asc" ? "desc" : "asc"));
    setOrderBy(property);
  }, [orderBy]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value.toLowerCase());
    setPage(0);
  }, []);

  if (pLoading || rLoading || !participants || !races) {
    return (
      <>
        <Banner title="Účastníci" />
        <Article>
          <div className="p-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="mb-2 flex gap-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-4 flex-1 animate-pulse rounded bg-grey-500/20" />
                ))}
              </div>
            ))}
          </div>
        </Article>
      </>
    );
  }

  const raceMapping = races.reduce<Record<string, string>>((o, k) => ({ ...o, [k.id]: k.name }), {});
  const rows: RowData[] = participants
    .map((p) => ({
      race: raceMapping[p.race] ?? p.race,
      nickName: p.nickName ?? "",
      firstName: p.firstName,
      lastName: p.lastName,
      group: p.group ?? "",
    }))
    .filter((p) => filterBySearch(p, search));

  const sorted = stableSort(rows, getSorting<RowData>(order, orderBy as keyof RowData));
  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  return (
    <>
      <Banner title="Účastníci" />
      <Article>
        {event.registrationList && (
          <div className="p-6 pb-0">
            <Markdown content={event.registrationList} />
          </div>
        )}
        <TableToolbar onSearch={handleSearch} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-sm">
            <SortableTableHead
              headers={headers}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleSort}
            />
            <tbody>
              {paged.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">{row.race}</td>
                  <td className="px-4 py-3">{row.nickName}</td>
                  <td className="px-4 py-3">{row.firstName}</td>
                  <td className="px-4 py-3">{row.lastName}</td>
                  <td className="px-4 py-3">{row.group}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-4 px-4 py-3 text-sm">
            <span className="text-grey-400">
              {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, rows.length)} z {rows.length}
            </span>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded px-3 py-1 hover:bg-white/10 disabled:opacity-30"
            >
              Předchozí
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded px-3 py-1 hover:bg-white/10 disabled:opacity-30"
            >
              Další
            </button>
          </div>
        )}
      </Article>
    </>
  );
}
