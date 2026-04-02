"use client";

import { collection, orderBy, query, type Query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { removeDocument } from "@/lib/admin-firestore";
import DataTable from "@/components/admin/DataTable";
import type { Gallery } from "@/lib/types";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useEventFilter } from "../_components/EventFilter";

const columns = [
  { key: "name", label: "Název", sortable: true },
  { key: "author", label: "Autor", sortable: true },
  { key: "event", label: "Událost", sortable: true },
];

export default function GalleriesListPage() {
  const [galleries, loading] = useCollectionData<Gallery>(
    query(collection(db, "galleries"), orderBy("name")) as Query<Gallery>,
  );
  const { filtered, toolbar } = useEventFilter(galleries ?? []);

  const handleDelete = async (gallery: Gallery) => {
    if (!confirm(`Smazat galerii "${gallery.name}"?`)) return;
    await removeDocument("galleries", gallery.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Galerie</h2>
        <Link
          href="/admin/galleries/new"
          className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nová galerie
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        basePath="/admin/galleries"
        onDelete={handleDelete}
        searchField="name"
        searchPlaceholder="Hledat galerii…"
        toolbar={toolbar}
      />
    </div>
  );
}
