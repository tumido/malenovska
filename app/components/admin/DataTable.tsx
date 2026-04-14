import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Eye,
  Search,
  Copy,
  SlidersHorizontal,
  X,
} from "lucide-react";

export interface ActiveFilter {
  label: string;
  onRemove: () => void;
}

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  basePath: string;
  onDelete?: (row: T) => void;
  actions?: ("show" | "edit" | "clone" | "delete")[];
  searchField?: string;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
  headerAction?: React.ReactNode;
  activeFilters?: ActiveFilter[];
}

const DataTable = <T extends { id: string }>({
  columns,
  data,
  loading,
  basePath,
  onDelete,
  actions = ["edit", "clone", "delete"],
  searchField,
  searchPlaceholder = "Hledat…",
  toolbar,
  headerAction,
  activeFilters,
}: DataTableProps<T>) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  let filtered = data;
  if (searchField && search) {
    const q = search.toLowerCase();
    filtered = data.filter((row) => {
      const val = (row as Record<string, unknown>)[searchField];
      return typeof val === "string" && val.toLowerCase().includes(q);
    });
  }

  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), "cs", {
        numeric: true,
      });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  return (
    <div className="space-y-4">
      {/* Desktop toolbar */}
      <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-3">
        {searchField && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="rounded border border-gray-600 bg-neutral-800 py-1.5 pl-9 pr-3 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        )}
        {toolbar}
        {headerAction && <div className="ml-auto">{headerAction}</div>}
      </div>

      {/* Mobile toolbar */}
      <div className="space-y-2 lg:hidden">
        <div className="flex items-center gap-2">
          {searchField && (
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded border border-gray-600 bg-neutral-800 py-1.5 pl-9 pr-3 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          )}
          {toolbar && (
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`shrink-0 rounded border p-2 transition-colors ${
                filtersOpen || (activeFilters && activeFilters.length > 0)
                  ? "border-secondary text-secondary"
                  : "border-gray-600 text-gray-400 hover:text-primary-light"
              }`}
              aria-label="Filtry"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          )}
          {headerAction}
        </div>

        {filtersOpen && (
          <div className="flex flex-col gap-3 rounded-lg border border-gray-700 bg-neutral-800 p-3 [&>select]:w-full">
            {toolbar}
          </div>
        )}

        {!filtersOpen && activeFilters && activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {activeFilters.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-neutral-700 px-2.5 py-1 text-xs text-primary-light"
              >
                {f.label}
                <button
                  onClick={f.onRemove}
                  className="rounded-full p-0.5 hover:bg-neutral-600 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}</div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-neutral-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-neutral-900 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 ${col.sortable ? "cursor-pointer select-none hover:text-gray-200" : ""}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable &&
                      sortKey === col.key &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </span>
                </th>
              ))}
              {actions.length > 0 && <th className="px-4 py-3 w-24" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  Načítání…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  Žádné záznamy
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-neutral-700 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render
                        ? col.render(row)
                        : String(
                            (row as Record<string, unknown>)[col.key] ?? "",
                          )}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {actions.includes("show") && (
                          <Link
                            to={`${basePath}/${row.id}`}
                            className="rounded p-1 text-gray-500  hover:text-gray-300"
                            title="Zobrazit"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        {actions.includes("edit") && (
                          <Link
                            to={`${basePath}/${row.id}`}
                            className="rounded p-1 text-gray-500  hover:text-secondary"
                            title="Upravit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        )}
                        {actions.includes("clone") && (
                          <Link
                            to={`${basePath}/new?clone=${row.id}`}
                            className="rounded p-1 text-gray-500  hover:text-blue-500"
                            title="Klonovat"
                          >
                            <Copy className="h-4 w-4" />
                          </Link>
                        )}
                        {actions.includes("delete") && onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="rounded p-1 text-gray-500  hover:text-red-600"
                            title="Smazat"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
