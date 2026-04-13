import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { createDocument, processPendingUploads } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, ImageField } from "@/components/admin/FormFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { useCloneData } from "@/lib/useCloneData";
import type { Legend } from "@/lib/types";
import { Timestamp } from "firebase/firestore";

const slugify = (title: string): string => {
  return title.replace(/ /g, "_").toLowerCase().replace(/\W/g, "");
};

const LegendCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<Partial<Legend>>(() => {
    const event = searchParams.get("event");
    return event ? { event } : {};
  });
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);
  const setFormStable = useCallback((data: Partial<Legend>) => setForm(data), []);
  const { isClone } = useCloneData<Legend>("legends", setFormStable);

  const handleSave = async () => {
    if (!form.title || !form.event || !form.perex || !form.content || !form.image?.src) {
      alert("Vyplňte všechna povinná pole");
      return;
    }
    setSaving(true);
    try {
      const id = slugify(form.title);
      const data = await processPendingUploads({
        ...form,
        publishedAt: Timestamp.now(),
      });
      await createDocument("legends", id, data);
      navigate("/admin/legends");
    } catch (err) {
      alert("Chyba při vytváření");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      key: "main",
      label: "Legenda",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Název"
              value={form.title ?? ""}
              onChange={(v) => setForm((p) => ({ ...p, title: v }))}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Událost<span className="text-red-500 ml-0.5">*</span></label>
              <select
                value={form.event ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, event: e.target.value }))}
                required
                className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                <option value="">Vyberte</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.name} ({ev.year})</option>
                ))}
              </select>
            </div>
          </div>
          <InputField
            label="Perex"
            value={form.perex ?? ""}
            onChange={(v) => setForm((p) => ({ ...p, perex: v }))}
            required
            maxLength={200}
          />
          <MarkdownEditor
            label="Obsah"
            value={form.content ?? ""}
            onChange={(v) => setForm((p) => ({ ...p, content: v }))}
            required
          />
          <ImageField
            label="Obrázek"
            value={form.image ?? { src: "" }}
            onChange={(v) => setForm((p) => ({ ...p, image: v }))}
            required
          />
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title={isClone ? "Klonovat legendu" : "Nová legenda"}
      tabs={tabs}
      onSubmit={handleSave}
      onCancel={() => navigate("/admin/legends")}
      saving={saving}
    />
  );
};

export default LegendCreatePage;
