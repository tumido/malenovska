import { orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import { removeDocument } from "@/lib/admin-firestore";
import DataTable from "@/components/admin/DataTable";
import type { Gallery } from "@/lib/types";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { useEventFilter } from "@/components/admin/EventFilter";

const columns = [
  { key: "name", label: "Název", sortable: true },
  { key: "author", label: "Autor", sortable: true },
  { key: "event", label: "Událost", sortable: true },
];

const GalleriesListPage = () => {
  const [galleries, loading] = useCollectionData(
    query(typedCollection<Gallery>("galleries"), orderBy("name")),
  );
  const { filtered, toolbar } = useEventFilter(galleries ?? []);

  const handleDelete = async (gallery: Gallery) => {
    if (!confirm(`Smazat galerii "${gallery.name}"?`)) return;
    await removeDocument("galleries", gallery.id);
  };

  return (
    <DataTable
      columns={columns}
      data={filtered}
      loading={loading}
      basePath="/admin/galleries"
      onDelete={handleDelete}
      searchField="name"
      searchPlaceholder="Hledat galerii…"
      toolbar={toolbar}
      headerAction={
        <Link
          to="/admin/galleries/new"
          className="inline-flex items-center gap-2 rounded bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary-dark transition-colors"
        >
          <Plus className="h-4 w-4" /> Nová galerie
        </Link>
      }
    />
  );
};

export default GalleriesListPage;
