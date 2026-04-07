"use client";

import { useState } from "react";
import Markdown from "markdown-to-jsx";
import { Eye, Pencil } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  rows?: number;
}

const MarkdownEditor = ({
  value,
  onChange,
  label,
  rows = 12,
}: MarkdownEditorProps) => {
  const [preview, setPreview] = useState(false);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="rounded-lg border border-gray-300 overflow-hidden">
        <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
              !preview ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Pencil className="h-3 w-3" /> Editace
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
              preview ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Eye className="h-3 w-3" /> Náhled
          </button>
        </div>

        {preview ? (
          <div className="prose prose-sm max-w-none p-4 min-h-[200px]">
            <Markdown>{value || ""}</Markdown>
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="w-full resize-y px-4 py-3 text-sm text-gray-900 focus:outline-none"
          />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
