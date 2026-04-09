import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { createDocument } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, ImageField } from "@/components/admin/FormFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { useCloneData } from "@/lib/useCloneData";
import type { Gallery } from "@/lib/types";

const GalleryCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<Partial<Gallery>>(() => {
    const event = searchParams.get("event");
    return event ? { event } : {};
  });
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);
  const setFormStable = useCallback((data: Partial<Gallery>) => setForm(data), []);
  const { isClone } = useCloneData<Gallery>("galleries", setFormStable);

  const set = (patch: Partial<Gallery>) => setForm((p) => ({ ...p, ...patch }));

  const handleSave = async () => {
    if (!form.name || !form.event || !form.author || !form.url) {
      alert("Vyplňte všechna povinná pole");
      return;
    }
    setSaving(true);
    try {
      const id = form.name.replace(/ /g, "_").toLowerCase().replace(/\W/g, "");
      await createDocument("galleries", id, form);
      navigate("/admin/galleries");
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
      label: "Galerie",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="Název" value={form.name ?? ""} onChange={(v) => set({ name: v })} required />
            <InputField label="Autor" value={form.author ?? ""} onChange={(v) => set({ author: v })} required />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Událost</label>
              <select
                value={form.event ?? ""}
                onChange={(e) => set({ event: e.target.value })}
                required
                className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                <option value="">Vyberte</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.name} ({ev.year})</option>
                ))}
              </select>
            </div>
            <InputField label="URL galerie" value={form.url ?? ""} onChange={(v) => set({ url: v })} type="url" required />
          </div>
          <ImageField
            label="Náhledový obrázek"
            value={form.cover ?? { src: "" }}
            onChange={(v) => set({ cover: v })}
          />
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title={isClone ? "Klonovat galerii" : "Nová galerie"}
      tabs={tabs}
      onSubmit={handleSave}
      onCancel={() => navigate("/admin/galleries")}
      saving={saving}
    />
  );
};

export default GalleryCreatePage;
