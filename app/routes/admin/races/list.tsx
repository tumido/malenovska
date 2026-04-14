import { orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import { removeDocument } from "@/lib/admin-firestore";
import DataTable from "@/components/admin/DataTable";
import type { Race } from "@/lib/types";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { useEventFilter } from "@/components/admin/EventFilter";

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
          className="inline-block h-4 w-4 rounded-full border border-gray-600"
          style={{ backgroundColor: r.color }}
        />
        {r.colorName}
      </span>
    ),
  },
];

const RacesListPage = () => {
  const [races, loading] = useCollectionData(
    query(typedCollection<Race>("races"), orderBy("name")),
  );
  const { filtered, toolbar, activeFilters } = useEventFilter(races ?? []);

  const handleDelete = async (race: Race) => {
    if (!confirm(`Smazat stranu "${race.name}"?`)) return;
    await removeDocument("races", race.id);
  };

  return (
    <DataTable
      columns={columns}
      data={filtered}
      loading={loading}
      basePath="/admin/races"
      onDelete={handleDelete}
      searchField="name"
      searchPlaceholder="Hledat stranu…"
      toolbar={toolbar}
      activeFilters={activeFilters}
      headerAction={
        <Link
          to="/admin/races/new"
          className="inline-flex items-center gap-2 rounded bg-secondary px-2.5 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary-dark lg:px-4"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden lg:inline">Nová strana</span>
        </Link>
      }
    />
  );
};

export default RacesListPage;
