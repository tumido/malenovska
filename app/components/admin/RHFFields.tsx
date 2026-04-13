import { useState, type ReactNode } from "react";
import { Controller, type Control, type ControllerRenderProps, type ControllerFieldState, type FieldValues, type Path } from "react-hook-form";
import {
  InputField,
  SelectField,
  ToggleField,
  CheckboxField,
  ColorField,
  ImageField,
  FileField,
  TextareaField,
  EventSelect,
} from "@/components/admin/FormFields";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

// --- NumericInput helper ---
// Allows clearing the field while typing; commits the number on blur.

interface NumericInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  fieldState: ControllerFieldState;
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  suffix?: string;
}

const NumericInput = ({ field, fieldState, ...rest }: NumericInputProps) => {
  const [localValue, setLocalValue] = useState<string | null>(null);

  return (
    <InputField
      {...rest}
      type="number"
      value={localValue ?? field.value ?? 0}
      onChange={(v) => {
        setLocalValue(v);
        if (v !== "" && v !== "-") field.onChange(Number(v));
      }}
      onBlur={() => {
        const num = localValue === "" || localValue == null ? 0 : Number(localValue);
        field.onChange(num);
        setLocalValue(null);
        field.onBlur();
      }}
      error={fieldState.error?.message}
    />
  );
};

// --- InputField ---

interface RHFInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  suffix?: string;
  maxLength?: number;
}

export const RHFInput = <T extends FieldValues>({
  control,
  name,
  type,
  ...rest
}: RHFInputProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) =>
      type === "number" ? (
        <NumericInput field={field} fieldState={fieldState} {...rest} />
      ) : (
        <InputField
          {...rest}
          type={type}
          value={field.value ?? ""}
          onChange={field.onChange}
          error={fieldState.error?.message}
        />
      )
    }
  />
);

// --- SelectField ---

interface RHFSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

export const RHFSelect = <T extends FieldValues>({
  control,
  name,
  ...rest
}: RHFSelectProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <SelectField
        {...rest}
        value={field.value ?? ""}
        onChange={field.onChange}
        error={fieldState.error?.message}
      />
    )}
  />
);

// --- ToggleField ---

interface RHFToggleProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
  warning?: boolean;
}

export const RHFToggle = <T extends FieldValues>({
  control,
  name,
  ...rest
}: RHFToggleProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <ToggleField
        {...rest}
        checked={field.value ?? false}
        onChange={field.onChange}
        error={fieldState.error?.message}
      />
    )}
  />
);

// --- CheckboxField ---

interface RHFCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export const RHFCheckbox = <T extends FieldValues>({
  control,
  name,
  ...rest
}: RHFCheckboxProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <CheckboxField
        {...rest}
        checked={field.value ?? false}
        onChange={field.onChange}
        error={fieldState.error?.message}
      />
    )}
  />
);

// --- ColorField ---

interface RHFColorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  presets?: string[];
  required?: boolean;
}

export const RHFColor = <T extends FieldValues>({
  control,
  name,
  ...rest
}: RHFColorProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <ColorField
        {...rest}
        value={field.value ?? ""}
        onChange={field.onChange}
        error={fieldState.error?.message}
      />
    )}
  />
);

// --- ImageField ---

interface RHFImageProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
}

export const RHFImage = <T extends FieldValues>({
  control,
  name,
  ...rest
}: RHFImageProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <ImageField
        {...rest}
        value={field.value ?? { src: "" }}
        onChange={field.onChange}
        error={fieldState.error?.message}
      />
    )}
  />
);

// --- FileField ---

interface RHFFileProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  accept?: string;
  required?: boolean;
}

export const RHFFile = <T extends FieldValues>({
  control,
  name,
  ...rest
}: RHFFileProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <FileField
        {...rest}
        value={field.value ?? { src: "" }}
        onChange={field.onChange}
        error={fieldState.error?.message}
      />
    )}
  />
);

// --- TextareaField ---

interface RHFTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rows?: number;
  required?: boolean;
}

export const RHFTextarea = <T extends FieldValues>({
  control,
  name,
  ...rest
}: RHFTextareaProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <TextareaField
        {...rest}
        value={field.value ?? ""}
        onChange={field.onChange}
        error={fieldState.error?.message}
      />
    )}
  />
);

// --- EventSelect ---

interface RHFEventSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  events: { id: string; name: string; year: number }[];
  required?: boolean;
}

export const RHFEventSelect = <T extends FieldValues>({
  control,
  name,
  ...rest
}: RHFEventSelectProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <EventSelect
        {...rest}
        value={field.value ?? ""}
        onChange={field.onChange}
        error={fieldState.error?.message}
      />
    )}
  />
);

// --- MarkdownEditor ---

interface RHFMarkdownProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  rows?: number;
  placeholder?: string;
  previewTransform?: (value: string) => string;
  insertables?: { label: string; value: string }[];
  singleLine?: boolean;
  required?: boolean;
  maxLength?: number;
}

export const RHFMarkdown = <T extends FieldValues>({
  control,
  name,
  ...rest
}: RHFMarkdownProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <MarkdownEditor
        {...rest}
        value={field.value ?? ""}
        onChange={field.onChange}
        error={fieldState.error?.message}
      />
    )}
  />
);
