"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, type DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { updateDocument } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, ImageField } from "@/components/admin/FormFields";
import { useEventFilter } from "../../_components/EventFilter";
import type { Gallery } from "@/lib/types";

const GalleryEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [gallery, loading] = useDocumentData<Gallery>(
    doc(db, "galleries", id) as DocumentReference<Gallery>,
  );
  const [form, setForm] = useState<Partial<Gallery>>({});
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);

  useEffect(() => {
    if (gallery && Object.keys(form).length === 0) {
      setForm({ ...gallery, id });
    }
  }, [gallery, id, form]);

  const set = (patch: Partial<Gallery>) => setForm((p) => ({ ...p, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = Object.fromEntries(Object.entries(form).filter(([k]) => k !== "id"));
      await updateDocument("galleries", id, data);
      router.push("/admin/galleries");
    } catch (err) {
      alert("Chyba při ukládání");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">Načítání…</div>;

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
      title={`Upravit: ${form.name ?? id}`}
      tabs={tabs}
      onSubmit={handleSave}
      onCancel={() => router.push("/admin/galleries")}
      saving={saving}
    />
  );
};

export default GalleryEditPage;
