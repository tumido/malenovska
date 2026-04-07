"use client";

import { orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import { removeDocument } from "@/lib/admin-firestore";
import DataTable from "@/components/admin/DataTable";
import type { Event } from "@/lib/types";
import Link from "next/link";
import { Plus, Check, X } from "lucide-react";

const columns = [
  { key: "name", label: "Název", sortable: true },
  { key: "year", label: "Rok", sortable: true },
  {
    key: "type",
    label: "Typ",
    render: (e: Event) => (e.type ? "Bitva" : "Šarvátka"),
  },
  {
    key: "display",
    label: "Zobrazena",
    render: (e: Event) =>
      e.display ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      ),
  },
  {
    key: "registrationAvailable",
    label: "Registrace",
    render: (e: Event) =>
      e.registrationAvailable ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      ),
  },
];

const EventsListPage = () => {
  const [events, loading] = useCollectionData(
    query(typedCollection<Event>("events"), orderBy("year", "desc")),
  );

  const handleDelete = async (event: Event) => {
    if (!confirm(`Opravdu smazat událost "${event.name}"?`)) return;
    await removeDocument("events", event.id);
  };

  return (
    <DataTable
      columns={columns}
      data={events ?? []}
      loading={loading}
      basePath="/admin/events"
      onDelete={handleDelete}
      searchField="name"
      searchPlaceholder="Hledat událost…"
      headerAction={
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 rounded bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary-dark transition-colors"
        >
          <Plus className="h-4 w-4" /> Nová událost
        </Link>
      }
    />
  );
};

export default EventsListPage;
