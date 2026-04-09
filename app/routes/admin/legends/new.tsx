import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { createDocument } from "@/lib/admin-firestore";
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
    if (!form.title || !form.event) {
      alert("Vyplňte název a událost");
      return;
    }
    setSaving(true);
    try {
      const id = slugify(form.title);
      await createDocument("legends", id, {
        ...form,
        publishedAt: Timestamp.now(),
      });
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
              <label className="block text-sm font-medium text-gray-300 mb-1">Událost</label>
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
            <InputField
              label="Perex"
              value={form.perex ?? ""}
              onChange={(v) => setForm((p) => ({ ...p, perex: v }))}
              required
            />
          </div>
          <MarkdownEditor
            label="Obsah"
            value={form.content ?? ""}
            onChange={(v) => setForm((p) => ({ ...p, content: v }))}
          />
          <ImageField
            label="Obrázek"
            value={form.image ?? { src: "" }}
            onChange={(v) => setForm((p) => ({ ...p, image: v }))}
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
