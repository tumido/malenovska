"use client";

import { TableSearch } from "@/components/TableSearch";

interface TableToolbarProps {
  onSearch: (value: string) => void;
}

export function TableToolbar({ onSearch }: TableToolbarProps) {
  return (
    <div className="flex items-center justify-end px-4 py-2">
      <TableSearch onSearch={onSearch} />
    </div>
  );
}
