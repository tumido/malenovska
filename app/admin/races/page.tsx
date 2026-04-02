"use client";

import { collection, orderBy, query, type Query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { removeDocument } from "@/lib/admin-firestore";
import DataTable from "@/components/admin/DataTable";
import type { Race } from "@/lib/types";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useEventFilter } from "../_components/EventFilter";

const columns = [
  { key: "name", label: "Název", sortable: true },
  { key: "event", label: "Událost", sortable: true },
  { key: "limit", label: "Limit", sortable: true },
  { key: "priority", label: "Priorita", sortable: true },
  {
    key: "color",
    label: "Barva",
    render: (r: Race) => (
      <span className="inline-flex items-center gap-2">
        <span
          className="inline-block h-4 w-4 rounded-full border border-gray-300"
          style={{ backgroundColor: r.color }}
        />
        {r.colorName}
      </span>
    ),
  },
];

export default function RacesListPage() {
  const [races, loading] = useCollectionData<Race>(
    query(collection(db, "races"), orderBy("name")) as Query<Race>,
  );
  const { filtered, toolbar } = useEventFilter(races ?? []);

  const handleDelete = async (race: Race) => {
    if (!confirm(`Smazat stranu "${race.name}"?`)) return;
    await removeDocument("races", race.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Strany</h2>
        <Link
          href="/admin/races/new"
          className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nová strana
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        basePath="/admin/races"
        onDelete={handleDelete}
        searchField="name"
        searchPlaceholder="Hledat stranu…"
        toolbar={toolbar}
      />
    </div>
  );
}
