import FormLayout from "@/components/admin/FormLayout";
import { InputField, SelectField, ColorField, ToggleField } from "@/components/admin/FormFields";
import {
  RHFInput,
  RHFMarkdown,
  RHFImage,
  RHFFile,
} from "@/components/admin/RHFFields";
import type { RegistrationExtra, POI } from "@/lib/types";
import type { EventFormValues } from "@/lib/schemas";
import { toTimeStr } from "@/lib/date";
import { Trash2, Plus, CircleHelp, Type, Hash, CheckSquare, FileText, ChevronDown } from "lucide-react";
import { lazy, Suspense, useRef, useState, useCallback, useEffect } from "react";
import {
  useFieldArray,
  useWatch,
  Controller,
  type Control,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import type { AdminMapHandle } from "@/components/admin/AdminMapInner";
import MarkdownEditor, { type Insertable } from "@/components/admin/MarkdownEditor";

const AdminMapInner = lazy(() => import("@/components/admin/AdminMapInner"));

interface EventFormTabsProps {
  control: Control<EventFormValues>;
  setValue: UseFormSetValue<EventFormValues>;
  watch: UseFormWatch<EventFormValues>;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving?: boolean;
  title: string;
  isEdit?: boolean;
}

const EventFormTabs = ({
  control,
  setValue,
  watch,
  onSave,
  onCancel,
  onDelete,
  saving,
  title,
  isEdit,
}: EventFormTabsProps) => {
  // Auto-derive year from date
  const dateValue = useWatch({ control, name: "date" });
  useEffect(() => {
    if (dateValue) {
      const d = dateValue instanceof Date ? dateValue : typeof dateValue === "object" && "toDate" in (dateValue as Record<string, unknown>) ? (dateValue as { toDate: () => Date }).toDate() : null;
      if (d) setValue("year", d.getFullYear());
    }
  }, [dateValue, setValue]);

  // Publishing requirements — fields optional for saving but required for visibility
  const displayMissing: string[] = [];
  if (!watch("declaration")?.src) displayMissing.push("prohlášení");
  if (!watch("rules")?.trim()) displayMissing.push("pravidla");
  if (!watch("registrationBeforeAbove")?.trim() || !watch("registrationBeforeBelow")?.trim() || !watch("registrationList")?.trim())
    displayMissing.push("texty registrace");
  if (!watch("contactText")?.trim()) displayMissing.push("kontaktní text");
  if (!watch("onsiteStart")) displayMissing.push("začátek akce v harmonogramu");
  if (!watch("poi")?.length) displayMissing.push("body na mapě");

  // Registration requirements — email templates must be set before opening registration
  const registrationMissing: string[] = [];
  if (!watch("emailSubject")?.trim()) registrationMissing.push("předmět e-mailu");
  if (!watch("emailBody")?.trim()) registrationMissing.push("tělo e-mailu");
  if (!watch("emailUnder18")?.trim()) registrationMissing.push("doplněk pro nezletilé");

  const tabs = [
    {
      key: "general",
      label: "Obecné",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Controller
              control={control}
              name="display"
              render={({ field }) => (
                <ToggleField
                  label="Zobrazit"
                  description={displayMissing.length > 0
                    ? <MissingList items={displayMissing} />
                    : "Událost je viditelná na webu"}
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  disabled={!field.value && displayMissing.length > 0}
                  warning={!!field.value && displayMissing.length > 0}
                />
              )}
            />
            <Controller
              control={control}
              name="registrationAvailable"
              render={({ field }) => (
                <ToggleField
                  label="Registrace otevřena"
                  description={registrationMissing.length > 0
                    ? <MissingList items={registrationMissing} />
                    : "Návštěvníci se mohou registrovat"}
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  disabled={!field.value && registrationMissing.length > 0}
                  warning={!!field.value && registrationMissing.length > 0}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Controller
              control={control}
              name="id"
              render={({ field, fieldState }) => (
                <InputField
                  label="ID"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  disabled={isEdit}
                  required={!isEdit}
                  error={fieldState.error?.message}
                />
              )}
            />
            <div className="sm:col-span-1 lg:col-span-3">
              <RHFInput control={control} name="name" label="Název" required />
            </div>
            <Controller
              control={control}
              name="date"
              render={({ field, fieldState }) => (
                <InputField
                  label="Datum"
                  value={field.value ? formatDate(field.value) : ""}
                  onChange={(v) => {
                    const d = new Date(v + "T00:00:00");
                    field.onChange(d);
                  }}
                  type="date"
                  required
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="year"
              render={({ field }) => (
                <InputField
                  label="Rok"
                  value={field.value ?? new Date().getFullYear()}
                  onChange={() => {}}
                  type="number"
                  disabled
                />
              )}
            />
            <RHFInput control={control} name="price" label="Cena" type="number" suffix="Kč" required />
            <Controller
              control={control}
              name="type"
              render={({ field, fieldState }) => (
                <SelectField
                  label="Typ"
                  value={field.value === true ? "true" : field.value === false ? "false" : ""}
                  onChange={(v) => field.onChange(v === "true")}
                  options={[
                    { value: "true", label: "Bitva" },
                    { value: "false", label: "Šarvátka" },
                  ]}
                  required
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
          <RHFMarkdown control={control} name="description" label="Popis" maxLength={200} />
          <RHFFile control={control} name="declaration" label="Prohlášení (PDF)" />
          <RHFImage control={control} name="heroImage" label="Hero obrázek (pozadí stránek)" />
        </div>
      ),
    },
    {
      key: "rules",
      label: "Pravidla",
      content: (
        <div className="space-y-4">
          <RHFMarkdown control={control} name="rules" label="Text pravidel" />
          <RHFImage control={control} name="rulesImage" label="Obrázek pravidel" />
        </div>
      ),
    },
    {
      key: "registration",
      label: "Registrace",
      content: (
        <div className="space-y-4">
          <RHFMarkdown control={control} name="registrationBeforeAbove" label="Text nad formulářem" rows={6} />
          <RHFMarkdown control={control} name="registrationBeforeBelow" label="Text pod formulářem" rows={6} />
          <RHFMarkdown control={control} name="registrationAfter" label="Text po registraci" rows={6} />
          <RHFMarkdown control={control} name="registrationList" label="Text u seznamu registrovaných" rows={6} />
          <RegistrationExtrasEditor control={control} />
        </div>
      ),
    },
    {
      key: "contacts",
      label: "Kontakty",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <RHFInput control={control} name="contact.facebook" label="Facebook" type="url" />
            <RHFInput control={control} name="contact.larpovadatabaze" label="Larpová databáze" type="url" />
            <RHFInput control={control} name="contact.larpcz" label="Larp.cz" type="url" />
            <RHFInput control={control} name="contact.email" label="E-mail" type="url" />
          </div>
          <RHFImage control={control} name="contactImage" label="Kontaktní obrázek" />
          <RHFMarkdown control={control} name="contactText" label="Kontaktní text" rows={6} />
        </div>
      ),
    },
    {
      key: "schedule",
      label: "Harmonogram",
      content: <ScheduleTimeline control={control} />,
    },
    {
      key: "email",
      label: "E-mail",
      content: <EmailTab control={control} watch={watch} />,
    },
    {
      key: "map",
      label: "Mapa",
      content: <POIEditor control={control} />,
    },
  ];

  return (
    <FormLayout
      title={title}
      tabs={tabs}
      onSubmit={onSave}
      onCancel={onCancel}
      onDelete={onDelete}
      saving={saving}
    />
  );
};

export default EventFormTabs;

/** POI array editor with interactive map */
const POIEditor = ({
  control,
}: {
  control: Control<EventFormValues>;
}) => {
  const mapRef = useRef<AdminMapHandle>(null);
  const DEFAULT_COLORS = ["#fd2600", "#f1ee10", "#ff9100"];

  const { fields, append, remove, update: updateField } = useFieldArray({
    control,
    name: "poi",
  });

  const addAt = (lat: number, lng: number) =>
    append({ name: "", description: "", latitude: lat, longitude: lng, color: DEFAULT_COLORS[fields.length % 3] });
  const addAtCenter = () => {
    const center = mapRef.current?.getCenter() ?? [49.75, 15.75];
    addAt(center[0], center[1]);
  };

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="overflow-hidden rounded border border-gray-700 [&_.leaflet-marker-icon]:drop-shadow-[8px_8px_8px_#000] [&_.leaflet-pane]:z-0">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-80 text-gray-400">
              Načítání mapy…
            </div>
          }
        >
          <AdminMapInner
            ref={mapRef}
            pois={fields as unknown as POI[]}
            onMarkerDrag={(i, lat, lng) => {
              updateField(i, { ...fields[i], latitude: lat, longitude: lng });
            }}
            onMapDoubleClick={(lat, lng) => addAt(lat, lng)}
          />
        </Suspense>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Dvojklikem na mapu přidáte nový bod. Přetažením markeru změníte pozici.
        </p>
        <button
          type="button"
          onClick={addAtCenter}
          className="inline-flex items-center gap-1 text-sm text-secondary hover:text-secondary-dark"
        >
          <Plus className="h-4 w-4" /> Přidat bod
        </button>
      </div>

      {/* POI list */}
      <div className="space-y-3">
        {fields.map((poi, i) => (
          <div
            key={poi.id}
            className="flex items-start gap-3 rounded border border-gray-700 p-3"
          >
            <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <RHFInput control={control} name={`poi.${i}.name`} label="Název" />
              <div className="sm:col-span-1 lg:col-span-3">
                <RHFInput control={control} name={`poi.${i}.description`} label="Popis" />
              </div>
              <Controller
                control={control}
                name={`poi.${i}.color`}
                render={({ field }) => (
                  <ColorField
                    label="Barva markeru"
                    value={field.value ?? DEFAULT_COLORS[i % 3]}
                    onChange={field.onChange}
                  />
                )}
              />
              <RHFInput
                control={control}
                name={`poi.${i}.latitude`}
                label="Zeměpisná šířka (N)"
                type="number"
              />
              <RHFInput
                control={control}
                name={`poi.${i}.longitude`}
                label="Zeměpisná délka (E)"
                type="number"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-2.5 shrink-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Type chip config */
const TYPE_CONFIG: Record<
  RegistrationExtra["type"],
  { icon: typeof Type; label: string; className: string }
> = {
  text: {
    icon: Type,
    label: "Text",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/25 hover:bg-blue-500/25",
  },
  number: {
    icon: Hash,
    label: "Číslo",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25",
  },
  checkbox: {
    icon: CheckSquare,
    label: "Zaškrtávací",
    className: "bg-purple-500/15 text-purple-400 border-purple-500/25 hover:bg-purple-500/25",
  },
  markdown: {
    icon: FileText,
    label: "Markdown",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/25 hover:bg-amber-500/25",
  },
};

/** Type chip with dropdown styled to match admin theme */
const TypeBadge = ({
  type,
  onChange,
}: {
  type: RegistrationExtra["type"];
  onChange: (type: RegistrationExtra["type"]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${config.className}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
        <ChevronDown
          className={`h-3 w-3 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1 w-40 rounded border border-gray-600 bg-neutral-900 py-1 shadow-xl">
            {(
              Object.entries(TYPE_CONFIG) as [
                RegistrationExtra["type"],
                (typeof TYPE_CONFIG)[RegistrationExtra["type"]],
              ][]
            ).map(([key, cfg]) => {
              const ItemIcon = cfg.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors ${
                    key === type
                      ? "bg-white/5 text-primary-light"
                      : "text-gray-400 hover:bg-white/5 hover:text-primary-light"
                  }`}
                >
                  <ItemIcon className={`h-3.5 w-3.5 ${key === type ? cfg.className.split(" ").find((c) => c.startsWith("text-")) ?? "" : ""}`} />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

/** Registration extras editor with resizable grid cards and drag-to-reorder */
const RegistrationExtrasEditor = ({
  control,
}: {
  control: Control<EventFormValues>;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [resizingIndex, setResizingIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    index: number;
    side: "before" | "after";
  } | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const dropTargetRef = useRef<{
    index: number;
    side: "before" | "after";
  } | null>(null);

  const { fields, append, remove, move, update: updateField } = useFieldArray({
    control,
    name: "registrationExtras",
  });

  const add = () =>
    append({ type: "text", size: 12, props: { id: "", label: "" } });

  // --- Resize handlers ---
  const handleResizeStart = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    if (!gridRef.current) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const colWidth = gridRect.width / 12;
    const cardEl = (e.target as HTMLElement).closest(
      "[data-extra-card]",
    ) as HTMLElement;
    if (!cardEl) return;

    const cardLeft = cardEl.getBoundingClientRect().left;
    setResizingIndex(index);

    const handleMouseMove = (ev: MouseEvent) => {
      const relativeX = ev.clientX - cardLeft;
      const newSize = Math.max(
        2,
        Math.min(12, Math.round(relativeX / colWidth)),
      );
      updateField(index, { ...fields[index], size: newSize });
    };

    const handleMouseUp = () => {
      setResizingIndex(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // --- Drag-and-drop reorder handlers ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    const cardEl = (e.target as HTMLElement).closest(
      "[data-extra-card]",
    ) as HTMLElement;
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect();
      e.dataTransfer.setDragImage(
        cardEl,
        e.clientX - rect.left,
        e.clientY - rect.top,
      );
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    dragIndexRef.current = index;
    requestAnimationFrame(() => setDragIndex(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndexRef.current === null || dragIndexRef.current === index) {
      dropTargetRef.current = null;
      setDropTarget(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const side =
      e.clientX < rect.left + rect.width / 2 ? "before" : "after";
    dropTargetRef.current = { index, side };
    setDropTarget({ index, side });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const di = dragIndexRef.current;
    const dt = dropTargetRef.current;
    if (di === null || !dt) return;

    let insertAt = dt.index;
    if (dt.side === "after") insertAt++;
    if (di < insertAt) insertAt--;

    move(di, insertAt);

    dragIndexRef.current = null;
    dropTargetRef.current = null;
    setDragIndex(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    dropTargetRef.current = null;
    setDragIndex(null);
    setDropTarget(null);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-300">
        Dodatečná pole registrace
      </h4>

      <div className="relative">
        {/* Column guides — visible during resize */}
        {resizingIndex !== null && (
          <div className="absolute inset-0 z-0 grid grid-cols-12 gap-3 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-full rounded bg-gray-700/15 border border-dashed border-gray-600/20"
              />
            ))}
          </div>
        )}

        <div
          ref={gridRef}
          className="relative z-10 grid grid-cols-12 gap-3 auto-rows-auto"
        >
          {fields.map((extra, i) => (
            <div
              key={extra.id}
              data-extra-card
              draggable
              onDragStart={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("input, textarea, select, button, [contenteditable]")) {
                  e.preventDefault();
                  return;
                }
                handleDragStart(e, i);
              }}
              onDragEnd={handleDragEnd}
              className={`group/card relative cursor-grab rounded-lg border transition-all ${
                resizingIndex === i
                  ? "border-secondary/50 shadow-lg shadow-secondary/5"
                  : dragIndex === i
                    ? "opacity-30 border-gray-700"
                    : "border-gray-700 hover:border-gray-600"
              }`}
              style={{ gridColumn: `span ${extra.size ?? 12}` }}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={handleDrop}
            >
              {/* Drop indicator */}
              {dropTarget?.index === i && (
                <div
                  className={`absolute top-0 bottom-0 w-0.5 rounded-full bg-secondary z-20 ${
                    dropTarget.side === "before" ? "-left-1.5" : "-right-1.5"
                  }`}
                />
              )}

              {/* Drag indicator */}
              <div className="absolute top-0 inset-x-0 h-3 flex items-center justify-center pointer-events-none">
                <div
                  className={`h-1 w-8 rounded-full transition-all ${
                    dragIndex === i
                      ? "bg-secondary"
                      : "bg-transparent group-hover/card:bg-gray-500"
                  }`}
                />
              </div>

              {/* Card content */}
              <div className="p-3 pr-5">
                <div className="flex items-center gap-2 mb-3">
                  <Controller
                    control={control}
                    name={`registrationExtras.${i}.type`}
                    render={({ field }) => (
                      <TypeBadge
                        type={field.value ?? "text"}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <div className="flex-1" />
                  <span
                    className={`text-xs tabular-nums transition-colors ${
                      resizingIndex === i ? "text-secondary" : "text-gray-500"
                    }`}
                  >
                    {extra.size ?? 12}/12
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="shrink-0 text-red-500/50 hover:text-red-500 transition-colors"
                    title="Odebrat pole"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {extra.type !== "markdown" ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <RHFInput control={control} name={`registrationExtras.${i}.props.id`} label="ID pole" />
                    <RHFInput control={control} name={`registrationExtras.${i}.props.label`} label="Popisek" />
                  </div>
                ) : (
                  <RHFMarkdown control={control} name={`registrationExtras.${i}.content`} label="Obsah" rows={4} />
                )}
              </div>

              {/* Resize handle */}
              <div
                className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize flex items-center justify-center"
                onMouseDown={(e) => handleResizeStart(e, i)}
              >
                <div
                  className={`h-8 w-1 rounded-full transition-all ${
                    resizingIndex === i
                      ? "bg-secondary"
                      : "bg-transparent group-hover/card:bg-gray-500"
                  }`}
                />
              </div>
            </div>
          ))}

          {/* Add / drop-at-end placeholder */}
          <div
            className={`col-span-12 flex items-center justify-center rounded-lg border border-dashed cursor-pointer transition-colors ${
              dragIndex !== null && dropTarget?.index === fields.length
                ? "border-secondary bg-secondary/5 text-secondary py-4"
                : dragIndex !== null
                  ? "border-gray-600/30 text-gray-500 py-4"
                  : "border-gray-600 text-gray-500 hover:border-gray-400 hover:text-gray-300 py-6"
            }`}
            onClick={dragIndex === null ? add : undefined}
            onDragOver={(e) => {
              if (dragIndexRef.current === null) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              dropTargetRef.current = { index: fields.length, side: "before" };
              setDropTarget({ index: fields.length, side: "before" });
            }}
            onDrop={handleDrop}
          >
            {dragIndex !== null ? (
              <span className="text-xs">Přesuňte sem</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm">
                <Plus className="h-4 w-4" /> Přidat pole
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Schedule timeline component */
const SCHEDULE_ITEMS: {
  key: keyof EventFormValues;
  label: string;
}[] = [
  { key: "onsiteStart", label: "Začátek akce" },
  { key: "onsiteRegistrationOpen", label: "Registrace otevřena" },
  { key: "onsiteRegistrationClose", label: "Registrace uzavřena" },
  { key: "onsiteRules", label: "Čtení pravidel" },
  { key: "onsiteQuestStart", label: "Start hry" },
  { key: "onsiteLastQuest", label: "Poslední bitva" },
  { key: "onsiteEnd", label: "Konec akce" },
];

const ScheduleTimeline = ({
  control,
}: {
  control: Control<EventFormValues>;
}) => (
  <div className="relative max-w-xl">
    <div className="absolute left-3.75 top-5 bottom-5 w-0.5 bg-gray-700" />

    <div className="space-y-1">
      {SCHEDULE_ITEMS.map(({ key, label }) => (
        <Controller
          key={key}
          control={control}
          name={key}
          render={({ field }) => {
            const timeStr = field.value ? toTimeStr(field.value as string) : "";
            const hasValue = !!timeStr;

            return (
              <div className="relative flex items-center gap-4 py-1.5">
                <div
                  className={`relative z-10 h-3 w-3 shrink-0 rounded-full border-2 ${
                    hasValue
                      ? "border-secondary bg-secondary"
                      : "border-gray-500 bg-neutral-800"
                  }`}
                  style={{ marginLeft: "9.5px" }}
                />
                <span className="w-44 shrink-0 text-sm text-gray-300">{label}</span>
                <input
                  type="time"
                  value={timeStr}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-32 rounded border border-gray-600 bg-neutral-900 px-3 py-1.5 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>
            );
          }}
        />
      ))}
    </div>
  </div>
);

/** Missing requirements list */
const MissingList = ({ items }: { items: string[] }) => (
  <>
    Chybí:
    <ul className="mt-0.5 list-disc list-inside">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  </>
);

/** Helper to format Firestore Timestamp or Date for date input */
const formatDate = (date: unknown): string => {
  if (!date) return "";
  if (
    typeof date === "object" &&
    "toDate" in (date as Record<string, unknown>)
  ) {
    return (date as { toDate: () => Date })
      .toDate()
      .toISOString()
      .split("T")[0];
  }
  if (date instanceof Date) return date.toISOString().split("T")[0];
  return String(date);
};

/** Email template variables reference */
const EMAIL_VARIABLES = [
  { variable: "{{name}}", description: "Celé jméno účastníka" },
  { variable: "{{group}}", description: "Skupina" },
  { variable: "{{race}}", description: "Název strany" },
  { variable: "{{age}}", description: "Věk" },
  { variable: "{{event}}", description: "Název události" },
  { variable: "{{year}}", description: "Rok" },
  { variable: "{{date}}", description: "Datum události" },
  { variable: "{{event_email}}", description: "E-mail události" },
  {
    variable: "{{confirmation_url}}",
    description: "Odkaz na stránku s prohlášením",
  },
] as const;

/** Replace {{variables}} with sample data for preview */
const substitutePreview = (
  template: string,
  sampleData: Record<string, string>,
): string =>
  template.replace(
    /\{\{(\w+)\}\}/g,
    (match, key: string) => sampleData[key] ?? match,
  );

/** Email template editing tab */
const EmailTab = ({
  control,
  watch,
}: {
  control: Control<EventFormValues>;
  watch: UseFormWatch<EventFormValues>;
}) => {
  const [helpOpen, setHelpOpen] = useState(false);

  const formName = watch("name");
  const formYear = watch("year");
  const formId = watch("id");

  const sampleData: Record<string, string> = {
    name: "Mirek (Mirek) Dušín",
    group: "Rychlé Šípy",
    race: "Lidé",
    age: "15",
    event: formName ?? "Malenovská",
    year: String(formYear ?? new Date().getFullYear()),
    date: "1. 6. 2026",
    event_email: `${formId ?? "malenovska"}@malenovska.cz`,
    confirmation_url: `https://www.malenovska.cz/${formId ?? "malenovska"}/confirmation`,
  };

  const previewTransform = useCallback(
    (value: string) => substitutePreview(value, sampleData),
    [formName, formYear, formId],
  );

  const emailInsertables: Insertable[] = EMAIL_VARIABLES.map(
    ({ variable, description }) => ({
      label: description,
      value: variable,
    }),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium text-gray-300">Šablony e-mailů</h4>
        <div className="relative">
          <button
            type="button"
            onClick={() => setHelpOpen(!helpOpen)}
            className="text-gray-400 hover:text-secondary transition-colors"
            title="Dostupné proměnné"
          >
            <CircleHelp className="h-4 w-4" />
          </button>
          {helpOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setHelpOpen(false)}
              />
              <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded border border-gray-600 bg-neutral-800 p-4 shadow-xl">
                <h5 className="mb-2 text-sm font-medium text-gray-200">
                  Dostupné proměnné
                </h5>
                <p className="mb-3 text-xs text-gray-400">
                  Vložte do šablony pro automatické nahrazení. V náhledu se
                  zobrazí ukázková data.
                </p>
                <table className="w-full text-xs">
                  <tbody>
                    {EMAIL_VARIABLES.map(({ variable, description }) => (
                      <tr key={variable} className="border-t border-gray-700">
                        <td className="py-1.5 pr-3 font-mono text-secondary">
                          {variable}
                        </td>
                        <td className="py-1.5 text-gray-300">{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <Controller
        control={control}
        name="emailSubject"
        render={({ field }) => (
          <MarkdownEditor
            label="Předmět"
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder="{{event}}: Registrace byla úspěšná"
            previewTransform={previewTransform}
            insertables={emailInsertables}
            singleLine
          />
        )}
      />

      <Controller
        control={control}
        name="emailBody"
        render={({ field }) => (
          <MarkdownEditor
            label="Tělo e-mailu"
            value={field.value ?? ""}
            onChange={field.onChange}
            rows={15}
            previewTransform={previewTransform}
            insertables={emailInsertables}
          />
        )}
      />

      <Controller
        control={control}
        name="emailUnder18"
        render={({ field }) => (
          <MarkdownEditor
            label="Doplněk pro nezletilé (připojí se pokud je věk < 18)"
            value={field.value ?? ""}
            onChange={field.onChange}
            rows={6}
            previewTransform={previewTransform}
            insertables={emailInsertables}
          />
        )}
      />
    </div>
  );
};
