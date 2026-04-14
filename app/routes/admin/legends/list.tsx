import { AdminListPage } from "@/components/admin/AdminListPage";
import type { Legend } from "@/lib/types";

const columns = [
  { key: "title", label: "Název", sortable: true },
  { key: "event", label: "Událost", sortable: true },
  {
    key: "perex",
    label: "Perex",
    render: (l: Legend) => (l.perex?.length > 60 ? l.perex.slice(0, 60) + "…" : l.perex),
  },
];

const LegendsListPage = () => (
  <AdminListPage<Legend>
    collection="legends"
    columns={columns}
    orderByField="title"
    searchField="title"
    searchPlaceholder="Hledat legendu…"
    newPath="/admin/legends/new"
    newLabel="Nová legenda"
    confirmMessage={(l) => `Smazat legendu "${l.title}"?`}
  />
);

export default LegendsListPage;
