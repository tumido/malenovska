import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { doc, type DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { updateDocument, removeDocument, processPendingUploads } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, ImageField } from "@/components/admin/FormFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import type { Gallery } from "@/lib/types";

const GalleryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gallery, loading] = useDocumentData<Gallery>(
    doc(db, "galleries", id!) as DocumentReference<Gallery>,
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
    if (!form.name || !form.event || !form.author || !form.url || !form.cover?.src) {
      alert("Vyplňte všechna povinná pole");
      return;
    }
    setSaving(true);
    try {
      const raw = Object.fromEntries(Object.entries(form).filter(([k]) => k !== "id"));
      const data = await processPendingUploads(raw);
      await updateDocument("galleries", id!, data);
      navigate("/admin/galleries");
    } catch (err) {
      alert("Chyba při ukládání");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Opravdu smazat galerii „${form.name ?? id}"?`)) return;
    try {
      await removeDocument("galleries", id!);
      navigate("/admin/galleries");
    } catch (err) {
      alert("Chyba při mazání");
      console.error(err);
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Událost<span className="text-red-500 ml-0.5">*</span></label>
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
          </div>
          <InputField label="Autor" value={form.author ?? ""} onChange={(v) => set({ author: v })} required />
          <InputField label="URL galerie" value={form.url ?? ""} onChange={(v) => set({ url: v })} type="url" required />
          <ImageField
            label="Náhledový obrázek"
            value={form.cover ?? { src: "" }}
            onChange={(v) => set({ cover: v })}
            required
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
      onCancel={() => navigate("/admin/galleries")}
      onDelete={handleDelete}
      saving={saving}
    />
  );
};

export default GalleryEditPage;
