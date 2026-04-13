
import { useRef, useCallback, useState } from "react";
import { FileText, ExternalLink, Upload } from "lucide-react";
import { registerPendingUpload } from "@/lib/admin-firestore";

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  suffix?: string;
  maxLength?: number;
}

export const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  required,
  disabled,
  placeholder,
  min,
  max,
  suffix,
  maxLength,
}: InputFieldProps) => {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {maxLength && (
          <span className={`text-xs ${String(value).length > maxLength ? "text-red-400" : "text-gray-500"}`}>
            {String(value).length}/{maxLength}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          min={min}
          max={max}
          maxLength={maxLength}
          className={`w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary disabled:bg-gray-800 disabled:text-gray-500 ${suffix ? "pr-12" : ""}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

export const SelectField = ({
  label,
  value,
  onChange,
  options,
  required,
  placeholder,
}: SelectFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxField = ({ label, checked, onChange }: CheckboxFieldProps) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-600 text-secondary focus:ring-secondary"
      />
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  );
};

interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleField = ({ label, description, checked, onChange }: ToggleFieldProps) => {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer rounded border border-gray-700 bg-neutral-900 px-4 py-3">
      <div>
        <span className="text-sm font-medium text-primary-light">{label}</span>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-secondary" : "bg-gray-600"}`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </label>
  );
};

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
}

export const TextareaField = ({
  label,
  value,
  onChange,
  rows = 4,
  required,
}: TextareaFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
        className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary resize-y"
      />
    </div>
  );
};

/** Shared drop zone logic for image/file fields — defers upload to save */
const useFileDropZone = (onChange: (value: { src: string }) => void) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const blobUrl = registerPendingUpload(file);
    onChange({ src: blobUrl });
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }, [handleFile]);

  return { dragging, setDragging, inputRef, onDrop, onFileChange };
};

interface ImageFieldProps {
  label: string;
  value: { src: string };
  onChange: (value: { src: string }) => void;
  required?: boolean;
}

export const ImageField = ({ label, value, onChange, required }: ImageFieldProps) => {
  const { dragging, setDragging, inputRef, onDrop, onFileChange } =
    useFileDropZone(onChange);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {/* Drop zone / preview */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded border-2 border-dashed transition-colors ${
          dragging
            ? "border-secondary bg-secondary/10"
            : value.src
              ? "border-gray-700 hover:border-gray-500"
              : required
                ? "border-red-500/50 hover:border-red-400"
                : "border-gray-600 hover:border-gray-400"
        }`}
      >
        {value.src ? (
          <div className="flex justify-center bg-neutral-900 p-4">
            <img
              src={value.src}
              alt=""
              className="max-h-48 rounded object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-400">
            <Upload className="h-8 w-8" />
            <span className="text-sm">Přetáhněte obrázek nebo klikněte</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
      {/* URL input */}
      <input
        type="url"
        value={value.src}
        onChange={(e) => onChange({ src: e.target.value })}
        placeholder="URL obrázku"
        className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
      />
    </div>
  );
};

interface FileFieldProps {
  label: string;
  value: { src: string };
  onChange: (value: { src: string }) => void;
  accept?: string;
  required?: boolean;
}

export const FileField = ({ label, value, onChange, accept, required }: FileFieldProps) => {
  const filename = value.src.split("/").pop()?.split("?")[0] || "";
  const isBlobUrl = value.src.startsWith("blob:");
  const { dragging, setDragging, inputRef, onDrop, onFileChange } =
    useFileDropZone(onChange);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {/* Preview or drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded border-2 border-dashed transition-colors ${
          dragging
            ? "border-secondary bg-secondary/10"
            : value.src
              ? "border-gray-700"
              : required
                ? "border-red-500/50 hover:border-red-400"
                : "border-gray-600 hover:border-gray-400"
        }`}
      >
        {value.src ? (
          <div className="flex items-center gap-3 p-3">
            <FileText className="h-8 w-8 shrink-0 text-gray-400" />
            <span className="min-w-0 flex-1 truncate text-sm text-primary-light">
              {isBlobUrl ? "Nový soubor (nahraje se při uložení)" : decodeURIComponent(filename)}
            </span>
            {!isBlobUrl && (
              <a
                href={value.src}
                target="_blank"
                rel="external"
                className="shrink-0 rounded p-1.5 text-gray-400 hover:text-secondary transition-colors"
                title="Otevřít soubor"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="shrink-0 text-xs text-secondary hover:text-secondary-dark transition-colors"
            >
              Nahradit
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 py-8 text-gray-400"
          >
            <Upload className="h-8 w-8" />
            <span className="text-sm">Přetáhněte soubor nebo klikněte</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onFileChange}
          className="hidden"
        />
      </div>
      {/* URL input — hide for pending uploads */}
      {!isBlobUrl && (
        <input
          type="url"
          value={value.src}
          onChange={(e) => onChange({ src: e.target.value })}
          placeholder="URL souboru"
          className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
        />
      )}
    </div>
  );
};

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presets?: string[];
  required?: boolean;
}

const DEFAULT_COLOR_PRESETS = [
  "#fd2600", // red (loading-red)
  "#f1ee10", // yellow (loading-yellow)
  "#ff9100", // orange (loading-orange)
  "#4caf50", // green
  "#2196f3", // blue
  "#9c27b0", // purple
  "#ffffff", // white
];

export const ColorField = ({
  label,
  value,
  onChange,
  presets = DEFAULT_COLOR_PRESETS,
  required,
}: ColorFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {presets.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`h-7 w-7 rounded border-2 transition-transform hover:scale-110 ${
                value.toLowerCase() === color.toLowerCase()
                  ? "border-white scale-110"
                  : "border-gray-600"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <input
          type="color"
          value={value || "#fd2600"}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 shrink-0 cursor-pointer rounded border border-gray-600 bg-transparent p-0"
          title="Vlastní barva"
        />
      </div>
    </div>
  );
};

interface EventSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  events: { id: string; name: string; year: number }[];
  required?: boolean;
  disabled?: boolean;
}

export const EventSelect = ({
  label,
  value,
  onChange,
  events,
  required,
}: EventSelectProps) => {
  return (
    <SelectField
      label={label}
      value={value}
      onChange={onChange}
      required={required}
      placeholder="Vyberte událost"
      options={events.map((e) => ({
        value: e.id,
        label: `${e.name} (${e.year})`,
      }))}
    />
  );
};
