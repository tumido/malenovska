import { orderBy, query, type OrderByDirection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import { removeDocument } from "@/lib/admin-firestore";
import DataTable from "@/components/admin/DataTable";
import { useEventFilter } from "@/components/admin/EventFilter";
import { Link } from "react-router";
import { Plus } from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface AdminListPageProps<T extends { id: string }> {
  collection: string;
  columns: Column<T>[];
  orderByField: string;
  orderByDirection?: OrderByDirection;
  searchField: string;
  searchPlaceholder: string;
  newPath: string;
  newLabel: string;
  useFilter?: boolean;
  actions?: ("show" | "edit" | "clone" | "delete")[];
  confirmMessage?: (row: T) => string;
  removeHandler?: (row: T) => Promise<void>;
}

export const AdminListPage = <T extends { id: string }>({
  collection,
  columns,
  orderByField,
  orderByDirection: direction,
  searchField,
  searchPlaceholder,
  newPath,
  newLabel,
  useFilter = true,
  actions,
  confirmMessage,
  removeHandler,
}: AdminListPageProps<T>) => {
  const [data, loading] = useCollectionData(
    query(
      typedCollection<T>(collection),
      ...(direction ? [orderBy(orderByField, direction)] : [orderBy(orderByField)]),
    ),
  );

  // Always call the hook to satisfy React's rules of hooks.
  // When useFilter is false, pass an empty array and ignore the results.
  const rawData = data ?? [];
  const filterInput = useFilter
    ? (rawData as Array<T & { event: string }>)
    : ([] as Array<T & { event: string }>);
  const { filtered, toolbar, activeFilters } = useEventFilter(filterInput);

  const displayed = useFilter ? filtered : rawData;

  const handleDelete = async (row: T) => {
    const message = confirmMessage
      ? confirmMessage(row)
      : "Opravdu smazat tento záznam?";
    if (!confirm(message)) return;

    if (removeHandler) {
      await removeHandler(row);
    } else {
      await removeDocument(collection, row.id);
    }
  };

  return (
    <DataTable
      columns={columns}
      data={displayed as T[]}
      loading={loading}
      basePath={`/admin/${collection}`}
      onDelete={handleDelete}
      searchField={searchField}
      searchPlaceholder={searchPlaceholder}
      {...(useFilter && { toolbar, activeFilters })}
      {...(actions && { actions })}
      headerAction={
        <Link
          to={newPath}
          className="inline-flex items-center gap-2 rounded bg-secondary px-2.5 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary-dark lg:px-4"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden lg:inline">{newLabel}</span>
        </Link>
      }
    />
  );
};
