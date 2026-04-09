"use client";

import { useState, useRef, useCallback } from "react";
import Markdown from "markdown-to-jsx";
import {
  Eye,
  Pencil,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Link,
  List,
  ListOrdered,
  Quote,
  Minus,
  Image,
  Code,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  rows?: number;
  previewTransform?: (value: string) => string;
}

interface ToolbarAction {
  icon: React.ElementType;
  title: string;
  action: (text: string, selStart: number, selEnd: number) => { text: string; cursor: number };
}

const wrap = (text: string, selStart: number, selEnd: number, before: string, after: string) => {
  const selected = text.slice(selStart, selEnd);
  const newText = text.slice(0, selStart) + before + selected + after + text.slice(selEnd);
  const cursor = selected.length > 0 ? selStart + before.length + selected.length + after.length : selStart + before.length;
  return { text: newText, cursor };
};

const prefixLine = (text: string, selStart: number, prefix: string) => {
  const lineStart = text.lastIndexOf("\n", selStart - 1) + 1;
  const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart);
  return { text: newText, cursor: selStart + prefix.length };
};

const toolbarActions: ToolbarAction[] = [
  {
    icon: Bold,
    title: "Tučné",
    action: (text, s, e) => wrap(text, s, e, "**", "**"),
  },
  {
    icon: Italic,
    title: "Kurzíva",
    action: (text, s, e) => wrap(text, s, e, "_", "_"),
  },
  {
    icon: Heading1,
    title: "Nadpis 1",
    action: (text, s) => prefixLine(text, s, "# "),
  },
  {
    icon: Heading2,
    title: "Nadpis 2",
    action: (text, s) => prefixLine(text, s, "## "),
  },
  {
    icon: Heading3,
    title: "Nadpis 3",
    action: (text, s) => prefixLine(text, s, "### "),
  },
  {
    icon: Quote,
    title: "Citace",
    action: (text, s) => prefixLine(text, s, "> "),
  },
  {
    icon: Code,
    title: "Kód",
    action: (text, s, e) => wrap(text, s, e, "`", "`"),
  },
  {
    icon: Link,
    title: "Odkaz",
    action: (text, s, e) => {
      const selected = text.slice(s, e);
      const replacement = selected ? `[${selected}](url)` : "[text](url)";
      const newText = text.slice(0, s) + replacement + text.slice(e);
      const cursor = selected ? s + selected.length + 3 : s + 1;
      return { text: newText, cursor };
    },
  },
  {
    icon: Image,
    title: "Obrázek",
    action: (text, s, e) => {
      const selected = text.slice(s, e);
      const replacement = selected ? `![${selected}](url)` : "![alt](url)";
      const newText = text.slice(0, s) + replacement + text.slice(e);
      const cursor = selected ? s + selected.length + 4 : s + 2;
      return { text: newText, cursor };
    },
  },
  {
    icon: List,
    title: "Odrážky",
    action: (text, s) => prefixLine(text, s, "- "),
  },
  {
    icon: ListOrdered,
    title: "Číslovaný seznam",
    action: (text, s) => prefixLine(text, s, "1. "),
  },
  {
    icon: Minus,
    title: "Oddělovač",
    action: (text, s) => {
      const lineStart = text.lastIndexOf("\n", s - 1) + 1;
      const before = lineStart > 0 ? "\n" : "";
      const insertion = before + "---\n";
      const newText = text.slice(0, lineStart) + insertion + text.slice(lineStart);
      return { text: newText, cursor: lineStart + insertion.length };
    },
  },
];

const MarkdownEditor = ({
  value,
  onChange,
  label,
  rows = 12,
  previewTransform,
}: MarkdownEditorProps) => {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleToolbarAction = useCallback(
    (action: ToolbarAction["action"]) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd } = textarea;
      const result = action(value, selectionStart, selectionEnd);
      onChange(result.text);

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(result.cursor, result.cursor);
      });
    },
    [value, onChange]
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">{label}</label>
      )}
      <div className="rounded border border-gray-600 bg-neutral-900 overflow-hidden focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary">
        <div className="flex flex-wrap items-center border-b border-gray-600">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              !preview ? "border-secondary text-secondary" : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Pencil className="h-3 w-3" /> Editace
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              preview ? "border-secondary text-secondary" : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Eye className="h-3 w-3" /> Náhled
          </button>

          {!preview && (
            <>
              <div className="mx-1 h-4 w-px bg-gray-600" />
              {toolbarActions.map(({ icon: Icon, title, action }) => (
                <button
                  key={title}
                  type="button"
                  title={title}
                  onClick={() => handleToolbarAction(action)}
                  className="rounded p-1.5 text-gray-400 hover:text-secondary transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </>
          )}
        </div>

        {preview ? (
          <div className="prose prose-sm prose-invert max-w-none p-4 min-h-[200px]">
            <Markdown>{previewTransform ? previewTransform(value || "") : (value || "")}</Markdown>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="w-full resize-y bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:outline-none"
          />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
