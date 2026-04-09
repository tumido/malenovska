import FormLayout from "@/components/admin/FormLayout";
import {
  InputField,
  SelectField,
  CheckboxField,
  ImageField,
  FileField,
} from "@/components/admin/FormFields";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import type { Event, POI, RegistrationExtra } from "@/lib/types";
import { toTimeStr } from "@/lib/date";
import { Trash2, Plus, CircleHelp } from "lucide-react";
import { useState, useCallback } from "react";

interface EventFormTabsProps {
  form: Partial<Event>;
  update: (key: keyof Event, value: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
  title: string;
  isEdit?: boolean;
}

const EventFormTabs = ({
  form,
  update,
  onSave,
  onCancel,
  saving,
  title,
  isEdit,
}: EventFormTabsProps) => {
  const tabs = [
    {
      key: "general",
      label: "Obecné",
      content: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="ID"
            value={form.id ?? ""}
            onChange={(v) => update("id", v)}
            disabled={isEdit}
          />
          <InputField
            label="Název"
            value={form.name ?? ""}
            onChange={(v) => update("name", v)}
            required
          />
          <InputField
            label="Rok"
            value={form.year ?? new Date().getFullYear()}
            onChange={(v) => update("year", Number(v))}
            type="number"
          />
          <InputField
            label="Datum"
            value={form.date ? formatDate(form.date) : ""}
            onChange={(v) => update("date", toTimestamp(v))}
            type="date"
          />
          <SelectField
            label="Typ"
            value={form.type === true ? "true" : form.type === false ? "false" : ""}
            onChange={(v) => update("type", v === "true")}
            options={[
              { value: "true", label: "Bitva" },
              { value: "false", label: "Šarvátka" },
            ]}
          />
          <div className="flex items-end gap-6">
            <CheckboxField
              label="Zobrazit"
              checked={form.display ?? false}
              onChange={(v) => update("display", v)}
            />
            <CheckboxField
              label="Registrace otevřena"
              checked={form.registrationAvailable ?? false}
              onChange={(v) => update("registrationAvailable", v)}
            />
          </div>
          <div className="sm:col-span-2">
            <MarkdownEditor
              label="Popis"
              value={form.description ?? ""}
              onChange={(v) => update("description", v)}
            />
          </div>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              onChange={(v) =>
                update("contact", { ...form.contact, email: v })
              }
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
      content: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="Začátek akce"
            value={form.onsiteStart ? toTimeStr(form.onsiteStart) : ""}
            onChange={(v) => update("onsiteStart", v)}
            type="time"
          />
          <InputField
            label="Konec akce"
            value={form.onsiteEnd ? toTimeStr(form.onsiteEnd) : ""}
            onChange={(v) => update("onsiteEnd", v)}
            type="time"
          />
          <InputField
            label="Registrace otevřena"
            value={form.onsiteRegistrationOpen ? toTimeStr(form.onsiteRegistrationOpen) : ""}
            onChange={(v) => update("onsiteRegistrationOpen", v)}
            type="time"
          />
          <InputField
            label="Registrace uzavřena"
            value={form.onsiteRegistrationClose ? toTimeStr(form.onsiteRegistrationClose) : ""}
            onChange={(v) => update("onsiteRegistrationClose", v)}
            type="time"
          />
          <InputField
            label="Čtení pravidel"
            value={form.onsiteRules ? toTimeStr(form.onsiteRules) : ""}
            onChange={(v) => update("onsiteRules", v)}
            type="time"
          />
          <InputField
            label="Start hry"
            value={form.onsiteQuestStart ? toTimeStr(form.onsiteQuestStart) : ""}
            onChange={(v) => update("onsiteQuestStart", v)}
            type="time"
          />
          <InputField
            label="Poslední bitva"
            value={form.onsiteLastQuest ? toTimeStr(form.onsiteLastQuest) : ""}
            onChange={(v) => update("onsiteLastQuest", v)}
            type="time"
          />
        </div>
      ),
    },
    {
      key: "other",
      label: "Ostatní",
      content: (
        <div className="space-y-4">
          <InputField
            label="Cena"
            value={form.price ?? 0}
            onChange={(v) => update("price", Number(v))}
            type="number"
          />
          <FileField
            label="Prohlášení (PDF)"
            value={form.declaration ?? { src: "" }}
            onChange={(v) => update("declaration", v)}
          />
        </div>
      ),
    },
    {
      key: "email",
      label: "E-mail",
      content: (
        <EmailTab form={form} update={update} />
      ),
    },
    {
      key: "map",
      label: "Mapa",
      content: (
        <POIEditor
          pois={form.poi ?? []}
          onChange={(v) => update("poi", v)}
        />
      ),
    },
  ];

  return (
    <FormLayout
      title={title}
      tabs={tabs}
      onSubmit={onSave}
      onCancel={onCancel}
      saving={saving}
    />
  );
};

export default EventFormTabs;

/** POI array editor */
const POIEditor = ({
  pois,
  onChange,
}: {
  pois: POI[];
  onChange: (pois: POI[]) => void;
}) => {
  const add = () =>
    onChange([...pois, { name: "", description: "", latitude: 0, longitude: 0 }]);
  const remove = (i: number) => onChange(pois.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof POI, value: string | number) =>
    onChange(pois.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-300">Body zájmu (POI)</h4>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-sm text-secondary hover:text-secondary-dark"
        >
          <Plus className="h-4 w-4" /> Přidat
        </button>
      </div>
      {pois.map((poi, i) => (
        <div key={i} className="grid grid-cols-1 gap-3 rounded border border-gray-700 p-4 sm:grid-cols-2">
          <InputField
            label="Název"
            value={poi.name}
            onChange={(v) => update(i, "name", v)}
          />
          <InputField
            label="Popis"
            value={poi.description}
            onChange={(v) => update(i, "description", v)}
          />
          <InputField
            label="Zeměpisná šířka"
            value={poi.latitude}
            onChange={(v) => update(i, "latitude", Number(v))}
            type="number"
            min={-90}
            max={90}
          />
          <InputField
            label="Zeměpisná délka"
            value={poi.longitude}
            onChange={(v) => update(i, "longitude", Number(v))}
            type="number"
            min={-180}
            max={180}
          />
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

/** Registration extras array editor */
const RegistrationExtrasEditor = ({
  extras,
  onChange,
}: {
  extras: RegistrationExtra[];
  onChange: (extras: RegistrationExtra[]) => void;
}) => {
  const add = () =>
    onChange([...extras, { type: "text", size: 12, props: { id: "", label: "" } }]);
  const remove = (i: number) => onChange(extras.filter((_, idx) => idx !== i));
  const update = (i: number, patch: Partial<RegistrationExtra>) =>
    onChange(extras.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-300">
          Dodatečná pole registrace
        </h4>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-sm text-secondary hover:text-secondary-dark"
        >
          <Plus className="h-4 w-4" /> Přidat
        </button>
      </div>
      {extras.map((extra, i) => (
        <div key={i} className="space-y-3 rounded border border-gray-700 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Typ</label>
              <select
                value={extra.type}
                onChange={(e) =>
                  update(i, { type: e.target.value as RegistrationExtra["type"] })
                }
                className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light"
              >
                <option value="text">Text</option>
                <option value="number">Číslo</option>
                <option value="checkbox">Zaškrtávací</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>
            <InputField
              label="Velikost (1-12)"
              value={extra.size ?? 12}
              onChange={(v) => update(i, { size: Number(v) })}
              type="number"
              min={1}
              max={12}
            />
            {extra.type !== "markdown" && (
              <>
                <InputField
                  label="ID pole"
                  value={extra.props?.id ?? ""}
                  onChange={(v) =>
                    update(i, { props: { ...extra.props, id: v } })
                  }
                />
                <InputField
                  label="Popisek"
                  value={extra.props?.label ?? ""}
                  onChange={(v) =>
                    update(i, { props: { ...extra.props, label: v } })
                  }
                />
              </>
            )}
            <div className={`${extra.type === "markdown" ? "sm:col-span-2" : "sm:col-span-4"} flex items-end justify-end`}>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-sm text-red-500 hover:text-red-700 pb-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {extra.type === "markdown" && (
            <MarkdownEditor
              label="Obsah"
              value={extra.content ?? ""}
              onChange={(v) => update(i, { content: v })}
              rows={6}
            />
          )}
        </div>
      ))}
    </div>
  );
};

/** Helper to format Firestore Timestamp or Date for date input */
const formatDate = (date: unknown): string => {
  if (!date) return "";
  if (typeof date === "object" && "toDate" in (date as Record<string, unknown>)) {
    return (date as { toDate: () => Date }).toDate().toISOString().split("T")[0];
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
  { variable: "{{confirmation_url}}", description: "Odkaz na stránku s prohlášením" },
] as const;

/** Replace {{variables}} with sample data for preview */
const substitutePreview = (template: string, sampleData: Record<string, string>): string =>
  template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => sampleData[key] ?? match);

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
              <div className="fixed inset-0 z-40" onClick={() => setHelpOpen(false)} />
              <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded border border-gray-600 bg-neutral-800 p-4 shadow-xl">
                <h5 className="mb-2 text-sm font-medium text-gray-200">Dostupné proměnné</h5>
                <p className="mb-3 text-xs text-gray-400">
                  Vložte do šablony pro automatické nahrazení. V náhledu se zobrazí ukázková data.
                </p>
                <table className="w-full text-xs">
                  <tbody>
                    {EMAIL_VARIABLES.map(({ variable, description }) => (
                      <tr key={variable} className="border-t border-gray-700">
                        <td className="py-1.5 pr-3 font-mono text-secondary">{variable}</td>
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

      <InputField
        label="Předmět"
        value={form.emailSubject ?? ""}
        onChange={(v) => update("emailSubject", v)}
        placeholder="{{event}}: Registrace byla úspěšná"
      />

      <MarkdownEditor
        label="Tělo e-mailu"
        value={form.emailBody ?? ""}
        onChange={(v) => update("emailBody", v)}
        rows={15}
        previewTransform={previewTransform}
      />

      <MarkdownEditor
        label="Doplněk pro nezletilé (připojí se pokud je věk < 18)"
        value={form.emailUnder18 ?? ""}
        onChange={(v) => update("emailUnder18", v)}
        rows={6}
        previewTransform={previewTransform}
      />
    </div>
  );
};
