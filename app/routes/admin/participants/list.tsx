import { useState } from "react";
import { useSearchParams } from "react-router";
import { doc, query, where, type DocumentReference } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { db, typedCollection } from "@/lib/firebase";
import { removeParticipant } from "@/lib/admin-firestore";
import { exportParticipantsCsv } from "@/lib/export-csv";
import DataTable from "@/components/admin/DataTable";
import type { Event, Participant, Race } from "@/lib/types";
import { useEventFilter } from "@/components/admin/EventFilter";
import { Download } from "lucide-react";

const ParticipantsListPage = () => {
  const [participants, loading] = useCollectionData(
    query(typedCollection<Participant>("participants")),
  );
  const { filtered, toolbar, eventId, activeFilters: eventActiveFilters } = useEventFilter(participants ?? []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [raceFilter, setRaceFilter] = useState("");
  const fieldFilter = searchParams.get("field") ?? "";
  const groupFilter = searchParams.get("group") ?? "";

  // Load races for the selected event for filtering and display
  const [races] = useCollectionData(
    eventId
      ? query(typedCollection<Race>("races"), where("event", "==", eventId))
      : null,
  );

  const [event] = useDocumentData<Event>(
    eventId ? (doc(db, "events", eventId) as DocumentReference<Event>) : null,
  );
  const fieldExtras = event?.registrationExtras?.filter(
    (e) => (e.type === "checkbox" || e.type === "text" || e.type === "number") && e.props?.id,
  ) ?? [];
  const checkboxExtras = event?.registrationExtras?.filter(
    (e) => e.type === "checkbox" && e.props?.id,
  ) ?? [];

  const raceMap = new Map((races ?? []).map((r) => [r.id, r]));

  let displayed = filtered;
  if (raceFilter) {
    displayed = displayed.filter((p) => p.race === raceFilter);
  }
  if (fieldFilter) {
    displayed = displayed.filter((p) => p[fieldFilter] === true);
  }
  if (groupFilter) {
    displayed = displayed.filter((p) => p.group === groupFilter);
  }

  const columns = [
    {
      key: "firstName",
      label: "Jméno",
      sortable: true,
      render: (p: Participant) => `${p.firstName} ${p.lastName}`,
    },
    { key: "nickName", label: "Přezdívka", sortable: true },
    { key: "group", label: "Skupina", sortable: true },
    {
      key: "race",
      label: "Strana",
      sortable: true,
      render: (p: Participant) => raceMap.get(p.race)?.name ?? p.race,
    },
  ];

  const handleDelete = async (participant: Participant) => {
    if (!confirm(`Smazat účastníka "${participant.firstName} ${participant.lastName}"?`)) return;
    await removeParticipant(participant.id);
  };

  const handleExport = () => {
    if (!eventId) {
      alert("Nejprve vyberte událost");
      return;
    }
    exportParticipantsCsv(displayed, races ?? [], fieldExtras);
  };

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const uniqueGroups = [...new Set(
    filtered.map((p) => (p.group as string) ?? "").filter(Boolean),
  )].sort();

  const filterToolbar = (
    <>
      {toolbar}
      {eventId && checkboxExtras.length > 0 && (
        <select
          value={fieldFilter}
          onChange={(e) => setFilter("field", e.target.value)}
          className="rounded border border-gray-600 bg-neutral-800 px-3 py-1.5 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
        >
          <option value="">Všechny údaje</option>
          {checkboxExtras.map((e) => (
            <option key={e.props!.id} value={e.props!.id!}>{e.props!.label ?? e.props!.id!}</option>
          ))}
        </select>
      )}
      {eventId && uniqueGroups.length > 0 && (
        <select
          value={groupFilter}
          onChange={(e) => setFilter("group", e.target.value)}
          className="rounded border border-gray-600 bg-neutral-800 px-3 py-1.5 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
        >
          <option value="">Všechny skupiny</option>
          {uniqueGroups.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      )}
      {eventId && races && (
        <select
          value={raceFilter}
          onChange={(e) => setRaceFilter(e.target.value)}
          className="rounded border border-gray-600 bg-neutral-800 px-3 py-1.5 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
        >
          <option value="">Všechny strany</option>
          {races.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      )}
    </>
  );

  const activeFilters = [
    ...eventActiveFilters,
    ...(fieldFilter
      ? [{
          label: checkboxExtras.find((e) => e.props?.id === fieldFilter)?.props?.label ?? fieldFilter,
          onRemove: () => setFilter("field", ""),
        }]
      : []),
    ...(groupFilter
      ? [{ label: groupFilter, onRemove: () => setFilter("group", "") }]
      : []),
    ...(raceFilter
      ? [{
          label: raceMap.get(raceFilter)?.name ?? raceFilter,
          onRemove: () => setRaceFilter(""),
        }]
      : []),
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={displayed}
        loading={loading}
        basePath="/admin/participants"
        onDelete={handleDelete}
        actions={["edit", "delete"]}
        searchField="nickName"
        searchPlaceholder="Hledat přezdívku…"
        toolbar={filterToolbar}
        activeFilters={activeFilters}
        headerAction={
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded border border-gray-600 px-2.5 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 lg:px-3 lg:py-1.5"
          >
            <Download className="h-4 w-4" />
            <span className="hidden lg:inline">CSV</span>
          </button>
        }
      />
    </div>
  );
};

export default ParticipantsListPage;
