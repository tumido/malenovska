"use client";

import { FileText, ExternalLink } from "lucide-react";

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
}: InputFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary disabled:bg-gray-800 disabled:text-gray-500"
      />
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

interface ImageFieldProps {
  label: string;
  value: { src: string; title?: string };
  onChange: (value: { src: string; title?: string }) => void;
}

export const ImageField = ({ label, value, onChange }: ImageFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {value.src && (
        <img
          src={value.src}
          alt={value.title || ""}
          className="h-32 w-auto rounded border border-gray-700 object-cover"
        />
      )}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="url"
          value={value.src}
          onChange={(e) => onChange({ ...value, src: e.target.value })}
          placeholder="URL obrázku"
          className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
        />
        <input
          type="text"
          value={value.title || ""}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Popisek"
          className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
        />
      </div>
    </div>
  );
};

interface FileFieldProps {
  label: string;
  value: { src: string; title?: string };
  onChange: (value: { src: string; title?: string }) => void;
}

export const FileField = ({ label, value, onChange }: FileFieldProps) => {
  const filename = value.title || value.src.split("/").pop()?.split("?")[0] || "";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {value.src && (
        <div className="flex items-center gap-3 rounded border border-gray-700 bg-neutral-900 p-3">
          <FileText className="h-8 w-8 shrink-0 text-gray-400" />
          <span className="min-w-0 flex-1 truncate text-sm text-primary-light">{filename}</span>
          <a
            href={value.src}
            target="_blank"
            rel="external"
            className="shrink-0 rounded p-1.5 text-gray-400 hover:text-secondary transition-colors"
            title="Otevřít soubor"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="url"
          value={value.src}
          onChange={(e) => onChange({ ...value, src: e.target.value })}
          placeholder="URL souboru"
          className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
        />
        <input
          type="text"
          value={value.title || ""}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Název souboru"
          className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
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
