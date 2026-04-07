"use client";

import { orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
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

const LegendsListPage = () => {
  const [legends, loading] = useCollectionData(
    query(typedCollection<Legend>("legends"), orderBy("title")),
  );
  const { filtered, toolbar } = useEventFilter(legends ?? []);

  const handleDelete = async (legend: Legend) => {
    if (!confirm(`Smazat legendu "${legend.title}"?`)) return;
    await removeDocument("legends", legend.id);
  };

  return (
    <DataTable
      columns={columns}
      data={filtered}
      loading={loading}
      basePath="/admin/legends"
      onDelete={handleDelete}
      searchField="title"
      searchPlaceholder="Hledat legendu…"
      toolbar={toolbar}
      headerAction={
        <Link
          href="/admin/legends/new"
          className="inline-flex items-center gap-2 rounded bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary-dark transition-colors"
        >
          <Plus className="h-4 w-4" /> Nová legenda
        </Link>
      }
    />
  );
};

export default LegendsListPage;
