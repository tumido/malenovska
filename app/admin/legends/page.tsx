"use client";

import { collection, orderBy, query, type Query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { removeDocument } from "@/lib/admin-firestore";
import DataTable from "@/components/admin/DataTable";
import type { Legend } from "@/lib/types";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useEventFilter } from "../_components/EventFilter";

const columns = [
  { key: "title", label: "Název", sortable: true },
  { key: "event", label: "Událost", sortable: true },
  {
    key: "perex",
    label: "Perex",
    render: (l: Legend) => (l.perex?.length > 60 ? l.perex.slice(0, 60) + "…" : l.perex),
  },
];

export default function LegendsListPage() {
  const [legends, loading] = useCollectionData<Legend>(
    query(collection(db, "legends"), orderBy("title")) as Query<Legend>,
  );
  const { filtered, toolbar } = useEventFilter(legends ?? []);

  const handleDelete = async (legend: Legend) => {
    if (!confirm(`Smazat legendu "${legend.title}"?`)) return;
    await removeDocument("legends", legend.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Legendy</h2>
        <Link
          href="/admin/legends/new"
          className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nová legenda
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        basePath="/admin/legends"
        onDelete={handleDelete}
        searchField="title"
        searchPlaceholder="Hledat legendu…"
        toolbar={toolbar}
      />
    </div>
  );
}
