"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, Pencil, Trash2, Eye, Search } from "lucide-react";

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
  actions?: ("show" | "edit" | "delete")[];
  searchField?: string;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
}

const DataTable = <T extends { id: string }>({
  columns,
  data,
  loading,
  basePath,
  onDelete,
  actions = ["edit", "delete"],
  searchField,
  searchPlaceholder = "Hledat…",
  toolbar,
}: DataTableProps<T>) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");

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
      const cmp = String(aVal).localeCompare(String(bVal), "cs", { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {searchField && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="rounded border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}
        {toolbar}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 ${col.sortable ? "cursor-pointer select-none hover:text-gray-700" : ""}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </span>
                </th>
              ))}
              {actions.length > 0 && <th className="px-4 py-3 w-24" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-4 py-8 text-center text-gray-400">
                  Načítání…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-4 py-8 text-center text-gray-400">
                  Žádné záznamy
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {actions.includes("show") && (
                          <Link
                            href={`${basePath}/${row.id}`}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title="Zobrazit"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        {actions.includes("edit") && (
                          <Link
                            href={`${basePath}/${row.id}`}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-indigo-600"
                            title="Upravit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        )}
                        {actions.includes("delete") && onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
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
