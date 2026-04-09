
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface TableSearchProps {
  onSearch: (value: string) => void;
}

export const TableSearch = ({ onSearch }: TableSearchProps) => {
  const [value, setValue] = useState("");

  useEffect(() => onSearch(value), [value, onSearch]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search size={16} className="text-grey-400" />
      </div>
      <input
        type="text"
        placeholder="Hledat…"
        aria-label="search"
        className="w-full rounded bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder-grey-400 transition-all focus:w-44 focus:bg-white/10 focus:outline-none md:w-28"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setValue("")}
      />
    </div>
  );
};
