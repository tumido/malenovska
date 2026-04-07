"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, ImageField } from "@/components/admin/FormFields";
import { useEventFilter } from "../../_components/EventFilter";
import type { Gallery } from "@/lib/types";

const GalleryCreatePage = () => {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Gallery>>({});
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);

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
      router.push("/admin/galleries");
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Událost</label>
              <select
                value={form.event ?? ""}
                onChange={(e) => set({ event: e.target.value })}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
      title="Nová galerie"
      tabs={tabs}
      onSubmit={handleSave}
      onCancel={() => router.push("/admin/galleries")}
      saving={saving}
    />
  );
};

export default GalleryCreatePage;
