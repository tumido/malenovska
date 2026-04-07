"use client";

import { useState } from "react";
import { collection, query, where, type Query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { removeParticipant, fetchParticipantPrivate } from "@/lib/admin-firestore";
import DataTable from "@/components/admin/DataTable";
import type { Participant, Race } from "@/lib/types";
import { useEventFilter } from "../_components/EventFilter";
import { Check, X, Download } from "lucide-react";

const ParticipantsListPage = () => {
  const [participants, loading] = useCollectionData<Participant>(
    query(collection(db, "participants")) as Query<Participant>,
  );
  const { filtered, toolbar, eventId } = useEventFilter(participants ?? []);
  const [raceFilter, setRaceFilter] = useState("");

  // Load races for the selected event for filtering and display
  const [races] = useCollectionData<Race>(
    eventId
      ? query(collection(db, "races"), where("event", "==", eventId)) as Query<Race>
      : null,
  );

  const raceMap = new Map((races ?? []).map((r) => [r.id, r]));

  let displayed = filtered;
  if (raceFilter) {
    displayed = displayed.filter((p) => p.race === raceFilter);
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
    {
      key: "afterparty",
      label: "Afterparty",
      render: (p: Participant) =>
        p.afterparty ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-gray-300" />,
    },
    {
      key: "sleepover",
      label: "Přespání",
      render: (p: Participant) =>
        p.sleepover ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-gray-300" />,
    },
  ];

  const handleDelete = async (participant: Participant) => {
    if (!confirm(`Smazat účastníka "${participant.firstName} ${participant.lastName}"?`)) return;
    await removeParticipant(participant.id);
  };

  const handleExport = async () => {
    if (!eventId) {
      alert("Nejprve vyberte událost");
      return;
    }
    const participantsToExport = displayed;
    const eventRaces = races ?? [];
    const raceNames = new Map(eventRaces.map((r) => [r.id, r.name]));

    const rows: string[][] = [
      ["Strana", "Skupina", "Jméno", "Přezdívka", "Příjmení", "Afterparty", "Přespání", "Věk", "E-mail"],
    ];

    for (const p of participantsToExport) {
      const priv = await fetchParticipantPrivate(p.id);
      rows.push([
        raceNames.get(p.race) ?? p.race,
        p.group ?? "",
        p.firstName,
        p.nickName ?? "",
        p.lastName,
        p.afterparty ? "Ano" : "Ne",
        p.sleepover ? "Ano" : "Ne",
        priv?.age?.toString() ?? "",
        priv?.email ?? "",
      ]);
    }

    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registrace.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const extraToolbar = (
    <>
      {toolbar}
      {eventId && races && (
        <select
          value={raceFilter}
          onChange={(e) => setRaceFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Všechny strany</option>
          {races.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      )}
      <button
        onClick={handleExport}
        className="inline-flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Download className="h-4 w-4" /> CSV
      </button>
    </>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Účastníci</h2>

      <DataTable
        columns={columns}
        data={displayed}
        loading={loading}
        basePath="/admin/participants"
        onDelete={handleDelete}
        actions={["edit", "delete"]}
        searchField="nickName"
        searchPlaceholder="Hledat přezdívku…"
        toolbar={extraToolbar}
      />
    </div>
  );
};

export default ParticipantsListPage;
