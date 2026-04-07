import { ChevronUp, ChevronDown } from "lucide-react";

export interface TableHeader {
  id: string;
  label: string;
}

interface SortableTableHeadProps {
  headers: TableHeader[];
  order: "asc" | "desc";
  orderBy: string;
  onRequestSort: (property: string) => void;
}

export const SortableTableHead = ({
  headers,
  order,
  orderBy,
  onRequestSort,
}: SortableTableHeadProps) => {
  return (
    <thead>
      <tr className="border-b border-white/10">
        {headers.map((cell) => (
          <th
            key={cell.id}
            className="px-4 py-3 text-left text-sm font-bold text-grey-400"
          >
            <button
              onClick={() => onRequestSort(cell.id)}
              className="inline-flex items-center gap-1 hover:text-white"
            >
              {cell.label}
              {orderBy === cell.id ? (
                order === "desc" ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronUp size={14} />
                )
              ) : (
                <ChevronUp size={14} className="opacity-25" />
              )}
            </button>
          </th>
        ))}
      </tr>
    </thead>
  );
};
