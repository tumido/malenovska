
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
  Table,
  Braces,
  ChevronDown,
} from "lucide-react";

export interface Insertable {
  label: string;
  value: string;
}

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  rows?: number;
  placeholder?: string;
  previewTransform?: (value: string) => string;
  insertables?: Insertable[];
  singleLine?: boolean;
  required?: boolean;
  maxLength?: number;
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
    icon: Table,
    title: "Tabulka",
    action: (text, s) => {
      const lineStart = text.lastIndexOf("\n", s - 1) + 1;
      const before = lineStart > 0 ? "\n" : "";
      const table = before + "| Sloupec 1 | Sloupec 2 | Sloupec 3 |\n| --- | --- | --- |\n|  |  |  |\n";
      const newText = text.slice(0, lineStart) + table + text.slice(lineStart);
      return { text: newText, cursor: lineStart + table.indexOf("Sloupec 1") };
    },
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
  placeholder,
  previewTransform,
  insertables,
  singleLine,
  required,
  maxLength,
}: MarkdownEditorProps) => {
  const [preview, setPreview] = useState(false);
  const [insertMenuOpen, setInsertMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const handleToolbarAction = useCallback(
    (action: ToolbarAction["action"]) => {
      const textarea = inputRef.current;
      if (!textarea) return;

      const selectionStart = textarea.selectionStart ?? 0;
      const selectionEnd = textarea.selectionEnd ?? 0;
      const result = action(value, selectionStart, selectionEnd);

      // Find the changed range by diffing old and new text
      let diffStart = 0;
      while (diffStart < value.length && diffStart < result.text.length && value[diffStart] === result.text[diffStart]) {
        diffStart++;
      }
      let diffEndOld = value.length;
      let diffEndNew = result.text.length;
      while (diffEndOld > diffStart && diffEndNew > diffStart && value[diffEndOld - 1] === result.text[diffEndNew - 1]) {
        diffEndOld--;
        diffEndNew--;
      }

      const replacement = result.text.slice(diffStart, diffEndNew);

      // Use execCommand to integrate with the browser's native undo stack
      textarea.focus();
      textarea.setSelectionRange(diffStart, diffEndOld);
      document.execCommand("insertText", false, replacement);

      requestAnimationFrame(() => {
        textarea.setSelectionRange(result.cursor, result.cursor);
      });
    },
    [value]
  );

  const handleInsert = useCallback(
    (snippet: string) => {
      const textarea = inputRef.current;
      if (!textarea) return;
      setInsertMenuOpen(false);

      textarea.focus();
      document.execCommand("insertText", false, snippet);
    },
    []
  );

  return (
    <div className="space-y-1">
      {(label || maxLength) && (
        <div className="flex items-baseline justify-between">
          {label && (
            <label className="block text-sm font-medium text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
          {maxLength && (
            <span className={`text-xs ${value.length > maxLength ? "text-red-400" : "text-gray-500"}`}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
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
              {!singleLine && (
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
              {insertables && insertables.length > 0 && (
                <>
                  <div className="mx-1 h-4 w-px bg-gray-600" />
                  <div className="relative">
                    <button
                      type="button"
                      title="Vložit proměnnou"
                      onClick={() => setInsertMenuOpen(!insertMenuOpen)}
                      className="flex items-center gap-0.5 rounded px-1.5 py-1.5 text-gray-400 hover:text-secondary transition-colors"
                    >
                      <Braces className="h-3.5 w-3.5" />
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {insertMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setInsertMenuOpen(false)} />
                        <div className="absolute left-0 top-full z-50 mt-1 min-w-48 rounded border border-gray-600 bg-neutral-800 py-1 shadow-xl">
                          {insertables.map(({ label: itemLabel, value: snippet }) => (
                            <button
                              key={snippet}
                              type="button"
                              onClick={() => handleInsert(snippet)}
                              className="flex w-full items-center gap-3 px-3 py-1.5 text-left text-xs hover:bg-neutral-700 transition-colors"
                            >
                              <span className="font-mono text-secondary">{snippet}</span>
                              <span className="text-gray-400">{itemLabel}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {preview ? (
          singleLine ? (
            <div className="px-3 py-2 text-sm text-primary-light">
              {previewTransform ? previewTransform(value || "") : (value || "")}
            </div>
          ) : (
            <div className="prose-editor max-w-none p-4 min-h-50">
              <Markdown>{previewTransform ? previewTransform(value || "") : (value || "")}</Markdown>
            </div>
          )
        ) : singleLine ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement | null>}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:outline-none"
          />
        ) : (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement | null>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            maxLength={maxLength}
            className="w-full resize-y bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:outline-none"
          />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
