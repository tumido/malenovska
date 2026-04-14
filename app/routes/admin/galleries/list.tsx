import { AdminListPage } from "@/components/admin/AdminListPage";
import type { Gallery } from "@/lib/types";

const columns = [
  { key: "name", label: "Název", sortable: true },
  { key: "author", label: "Autor", sortable: true },
  { key: "event", label: "Událost", sortable: true },
];

const GalleriesListPage = () => (
  <AdminListPage<Gallery>
    collection="galleries"
    columns={columns}
    orderByField="name"
    searchField="name"
    searchPlaceholder="Hledat galerii…"
    newPath="/admin/galleries/new"
    newLabel="Nová galerie"
    actions={["edit", "delete"]}
    confirmMessage={(g) => `Smazat galerii "${g.name}"?`}
  />
);

export default GalleriesListPage;
