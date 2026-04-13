import FormLayout from "@/components/admin/FormLayout";
import {
  InputField,
  SelectField,
  ToggleField,
  ColorField,
  ImageField,
  FileField,
} from "@/components/admin/FormFields";
import MarkdownEditor, {
  type Insertable,
} from "@/components/admin/MarkdownEditor";
import type { Event, POI, RegistrationExtra } from "@/lib/types";
import { toTimeStr } from "@/lib/date";
import { Trash2, Plus, CircleHelp, Type, Hash, CheckSquare, FileText, ChevronDown } from "lucide-react";
import { lazy, Suspense, useRef, useState, useCallback } from "react";
import type { AdminMapHandle } from "@/components/admin/AdminMapInner";

const AdminMapInner = lazy(() => import("@/components/admin/AdminMapInner"));

interface EventFormTabsProps {
  form: Partial<Event>;
  update: (key: keyof Event, value: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving?: boolean;
  title: string;
  isEdit?: boolean;
}

const EventFormTabs = ({
  form,
  update,
  onSave,
  onCancel,
  onDelete,
  saving,
  title,
  isEdit,
}: EventFormTabsProps) => {
  const tabs = [
    {
      key: "general",
      label: "Obecné",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ToggleField
              label="Zobrazit"
              description="Událost je viditelná na webu"
              checked={form.display ?? false}
              onChange={(v) => update("display", v)}
            />
            <ToggleField
              label="Registrace otevřena"
              description="Návštěvníci se mohou registrovat"
              checked={form.registrationAvailable ?? false}
              onChange={(v) => update("registrationAvailable", v)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InputField
              label="ID"
              value={form.id ?? ""}
              onChange={(v) => update("id", v)}
              disabled={isEdit}
            />
            <div className="sm:col-span-1 lg:col-span-3">
              <InputField
                label="Název"
                value={form.name ?? ""}
                onChange={(v) => update("name", v)}
                required
              />
            </div>
            <InputField
              label="Datum"
              value={form.date ? formatDate(form.date) : ""}
              onChange={(v) => {
                const d = toTimestamp(v) as Date;
                update("date", d);
                update("year", d.getFullYear());
              }}
              type="date"
              required
            />
            <InputField
              label="Rok"
              value={form.year ?? new Date().getFullYear()}
              onChange={() => {}}
              type="number"
              disabled
            />
            <InputField
              label="Cena"
              value={form.price ?? 0}
              onChange={(v) => update("price", Number(v))}
              type="number"
              suffix="Kč"
              required
            />
            <SelectField
              label="Typ"
              value={
                form.type === true ? "true" : form.type === false ? "false" : ""
              }
              onChange={(v) => update("type", v === "true")}
              options={[
                { value: "true", label: "Bitva" },
                { value: "false", label: "Šarvátka" },
              ]}
              required
            />
          </div>
          <MarkdownEditor
            label="Popis"
            value={form.description ?? ""}
            onChange={(v) => update("description", v)}
            maxLength={200}
          />
          <FileField
            label="Prohlášení (PDF)"
            value={form.declaration ?? { src: "" }}
            onChange={(v) => update("declaration", v)}
          />
          <ImageField
            label="Hero obrázek (pozadí stránek)"
            value={form.heroImage ?? { src: "" }}
            onChange={(v) => update("heroImage", v)}
          />
        </div>
      ),
    },
    {
      key: "rules",
      label: "Pravidla",
      content: (
        <div className="space-y-4">
          <MarkdownEditor
            label="Text pravidel"
            value={form.rules ?? ""}
            onChange={(v) => update("rules", v)}
          />
          <ImageField
            label="Obrázek pravidel"
            value={form.rulesImage ?? { src: "" }}
            onChange={(v) => update("rulesImage", v)}
          />
        </div>
      ),
    },
    {
      key: "registration",
      label: "Registrace",
      content: (
        <div className="space-y-4">
          <MarkdownEditor
            label="Text nad formulářem"
            value={form.registrationBeforeAbove ?? ""}
            onChange={(v) => update("registrationBeforeAbove", v)}
            rows={6}
          />
          <MarkdownEditor
            label="Text pod formulářem"
            value={form.registrationBeforeBelow ?? ""}
            onChange={(v) => update("registrationBeforeBelow", v)}
            rows={6}
          />
          <MarkdownEditor
            label="Text po registraci"
            value={form.registrationAfter ?? ""}
            onChange={(v) => update("registrationAfter", v)}
            rows={6}
          />
          <MarkdownEditor
            label="Text u seznamu registrovaných"
            value={form.registrationList ?? ""}
            onChange={(v) => update("registrationList", v)}
            rows={6}
          />
          <RegistrationExtrasEditor
            extras={form.registrationExtras ?? []}
            onChange={(v) => update("registrationExtras", v)}
          />
        </div>
      ),
    },
    {
      key: "contacts",
      label: "Kontakty",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InputField
              label="Facebook"
              value={form.contact?.facebook ?? ""}
              onChange={(v) =>
                update("contact", { ...form.contact, facebook: v })
              }
              type="url"
            />
            <InputField
              label="Larpová databáze"
              value={form.contact?.larpovadatabaze ?? ""}
              onChange={(v) =>
                update("contact", { ...form.contact, larpovadatabaze: v })
              }
              type="url"
            />
            <InputField
              label="Larp.cz"
              value={form.contact?.larpcz ?? ""}
              onChange={(v) =>
                update("contact", { ...form.contact, larpcz: v })
              }
              type="url"
            />
            <InputField
              label="E-mail"
              value={form.contact?.email ?? ""}
              onChange={(v) => update("contact", { ...form.contact, email: v })}
              type="url"
            />
          </div>
          <ImageField
            label="Kontaktní obrázek"
            value={form.contactImage ?? { src: "" }}
            onChange={(v) => update("contactImage", v)}
          />
          <MarkdownEditor
            label="Kontaktní text"
            value={form.contactText ?? ""}
            onChange={(v) => update("contactText", v)}
            rows={6}
          />
        </div>
      ),
    },
    {
      key: "schedule",
      label: "Harmonogram",
      content: <ScheduleTimeline form={form} update={update} />,
    },
    {
      key: "email",
      label: "E-mail",
      content: <EmailTab form={form} update={update} />,
    },
    {
      key: "map",
      label: "Mapa",
      content: (
        <POIEditor pois={form.poi ?? []} onChange={(v) => update("poi", v)} />
      ),
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
  pois,
  onChange,
}: {
  pois: POI[];
  onChange: (pois: POI[]) => void;
}) => {
  const mapRef = useRef<AdminMapHandle>(null);
  const DEFAULT_COLORS = ["#fd2600", "#f1ee10", "#ff9100"];
  const addAt = (lat: number, lng: number) =>
    onChange([...pois, { name: "", description: "", latitude: lat, longitude: lng, color: DEFAULT_COLORS[pois.length % 3] }]);
  const addAtCenter = () => {
    const center = mapRef.current?.getCenter() ?? [49.75, 15.75];
    addAt(center[0], center[1]);
  };
  const remove = (i: number) => onChange(pois.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof POI, value: string | number) =>
    onChange(pois.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)));

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
            pois={pois}
            onMarkerDrag={(i, lat, lng) => {
              onChange(pois.map((p, idx) => (idx === i ? { ...p, latitude: lat, longitude: lng } : p)));
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
        {pois.map((poi, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded border border-gray-700 p-3"
          >
            <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <InputField
                label="Název"
                value={poi.name}
                onChange={(v) => update(i, "name", v)}
              />
              <div className="sm:col-span-1 lg:col-span-3">
                <InputField
                  label="Popis"
                  value={poi.description}
                  onChange={(v) => update(i, "description", v)}
                />
              </div>
              <ColorField
                label="Barva markeru"
                value={poi.color ?? DEFAULT_COLORS[i % 3]}
                onChange={(v) => update(i, "color", v)}
              />
              <InputField
                label="Zeměpisná šířka (N)"
                value={Math.round(poi.latitude * 1e6) / 1e6}
                onChange={(v) => update(i, "latitude", Number(v))}
                type="number"
              />
              <InputField
                label="Zeměpisná délka (E)"
                value={Math.round(poi.longitude * 1e6) / 1e6}
                onChange={(v) => update(i, "longitude", Number(v))}
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
  extras,
  onChange,
}: {
  extras: RegistrationExtra[];
  onChange: (extras: RegistrationExtra[]) => void;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [resizingIndex, setResizingIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    index: number;
    side: "before" | "after";
  } | null>(null);
  const extrasRef = useRef(extras);
  extrasRef.current = extras;
  const dragIndexRef = useRef<number | null>(null);
  const dropTargetRef = useRef<{
    index: number;
    side: "before" | "after";
  } | null>(null);

  const add = () =>
    onChange([
      ...extras,
      { type: "text", size: 12, props: { id: "", label: "" } },
    ]);
  const remove = (i: number) => onChange(extras.filter((_, idx) => idx !== i));
  const updateExtra = (i: number, patch: Partial<RegistrationExtra>) =>
    onChange(
      extrasRef.current.map((e, idx) => (idx === i ? { ...e, ...patch } : e)),
    );

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
      updateExtra(index, { size: newSize });
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

  // --- Drag-and-drop reorder handlers (refs avoid stale closures between dragover→drop) ---
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
    // Defer state update so the browser finishes drag initialization before React re-renders
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

    const newExtras = [...extrasRef.current];
    const [dragged] = newExtras.splice(di, 1);

    let insertAt = dt.index;
    if (dt.side === "after") insertAt++;
    if (di < insertAt) insertAt--;

    newExtras.splice(insertAt, 0, dragged);
    onChange(newExtras);

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
          {extras.map((extra, i) => (
            <div
              key={i}
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

              {/* Drag indicator — visual only, events pass through to card */}
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
                {/* Header: type select + size indicator + delete */}
                <div className="flex items-center gap-2 mb-3">
                  {/* Type chip selector */}
                  <TypeBadge
                    type={extra.type}
                    onChange={(t) => updateExtra(i, { type: t })}
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

                {/* Body: type-specific fields */}
                {extra.type !== "markdown" ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <InputField
                      label="ID pole"
                      value={extra.props?.id ?? ""}
                      onChange={(v) =>
                        updateExtra(i, { props: { ...extra.props, id: v } })
                      }
                    />
                    <InputField
                      label="Popisek"
                      value={extra.props?.label ?? ""}
                      onChange={(v) =>
                        updateExtra(i, { props: { ...extra.props, label: v } })
                      }
                    />
                  </div>
                ) : (
                  <MarkdownEditor
                    label="Obsah"
                    value={extra.content ?? ""}
                    onChange={(v) => updateExtra(i, { content: v })}
                    rows={4}
                  />
                )}
              </div>

              {/* Resize handle — right edge */}
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

          {/* Add / drop-at-end placeholder card */}
          <div
            className={`col-span-12 flex items-center justify-center rounded-lg border border-dashed cursor-pointer transition-colors ${
              dragIndex !== null && dropTarget?.index === extras.length
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
              dropTargetRef.current = { index: extras.length, side: "before" };
              setDropTarget({ index: extras.length, side: "before" });
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
  key: keyof Event;
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
  form,
  update,
}: {
  form: Partial<Event>;
  update: (key: keyof Event, value: unknown) => void;
}) => (
  <div className="relative max-w-xl">
    {/* Vertical timeline line */}
    <div className="absolute left-3.75 top-5 bottom-5 w-0.5 bg-gray-700" />

    <div className="space-y-1">
      {SCHEDULE_ITEMS.map(({ key, label }) => {
        const value = form[key];
        const timeStr = value ? toTimeStr(value as string) : "";
        const hasValue = !!timeStr;

        return (
          <div key={key} className="relative flex items-center gap-4 py-1.5">
            {/* Timeline dot */}
            <div
              className={`relative z-10 h-3 w-3 shrink-0 rounded-full border-2 ${
                hasValue
                  ? "border-secondary bg-secondary"
                  : "border-gray-500 bg-neutral-800"
              }`}
              style={{ marginLeft: "9.5px" }}
            />

            {/* Label */}
            <span className="w-44 shrink-0 text-sm text-gray-300">{label}</span>

            {/* Time input */}
            <input
              type="time"
              value={timeStr}
              onChange={(e) => update(key, e.target.value)}
              className="w-32 rounded border border-gray-600 bg-neutral-900 px-3 py-1.5 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        );
      })}
    </div>
  </div>
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

/** Convert date string to Firestore-compatible value */
const toTimestamp = (dateStr: string): unknown => {
  return new Date(dateStr + "T00:00:00");
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
  form,
  update,
}: {
  form: Partial<Event>;
  update: (key: keyof Event, value: unknown) => void;
}) => {
  const [helpOpen, setHelpOpen] = useState(false);

  const sampleData: Record<string, string> = {
    name: "Mirek (Mirek) Dušín",
    group: "Rychlé Šípy",
    race: "Lidé",
    age: "15",
    event: form.name ?? "Malenovská",
    year: String(form.year ?? new Date().getFullYear()),
    date: "1. 6. 2026",
    event_email: `${form.id ?? "malenovska"}@malenovska.cz`,
    confirmation_url: `https://www.malenovska.cz/${form.id ?? "malenovska"}/confirmation`,
  };

  const previewTransform = useCallback(
    (value: string) => substitutePreview(value, sampleData),
    [form.name, form.year, form.id], // intentionally partial deps — only re-create when event identity changes
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

      <MarkdownEditor
        label="Předmět"
        value={form.emailSubject ?? ""}
        onChange={(v) => update("emailSubject", v)}
        placeholder="{{event}}: Registrace byla úspěšná"
        previewTransform={previewTransform}
        insertables={emailInsertables}
        singleLine
      />

      <MarkdownEditor
        label="Tělo e-mailu"
        value={form.emailBody ?? ""}
        onChange={(v) => update("emailBody", v)}
        rows={15}
        previewTransform={previewTransform}
        insertables={emailInsertables}
      />

      <MarkdownEditor
        label="Doplněk pro nezletilé (připojí se pokud je věk < 18)"
        value={form.emailUnder18 ?? ""}
        onChange={(v) => update("emailUnder18", v)}
        rows={6}
        previewTransform={previewTransform}
        insertables={emailInsertables}
      />
    </div>
  );
};
