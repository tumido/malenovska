import { AdminListPage } from "@/components/admin/AdminListPage";
import type { Race } from "@/lib/types";

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

const RacesListPage = () => (
  <AdminListPage<Race>
    collection="races"
    columns={columns}
    orderByField="name"
    searchField="name"
    searchPlaceholder="Hledat stranu…"
    newPath="/admin/races/new"
    newLabel="Nová strana"
    confirmMessage={(r) => `Smazat stranu "${r.name}"?`}
  />
);

export default RacesListPage;
