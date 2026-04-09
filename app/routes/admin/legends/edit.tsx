import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { doc, type DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { updateDocument } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, ImageField } from "@/components/admin/FormFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import type { Legend } from "@/lib/types";

const LegendEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [legend, loading] = useDocumentData<Legend>(
    doc(db, "legends", id!) as DocumentReference<Legend>,
  );
  const [form, setForm] = useState<Partial<Legend>>({});
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);

  useEffect(() => {
    if (legend && Object.keys(form).length === 0) {
      setForm({ ...legend, id });
    }
  }, [legend, id, form]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = Object.fromEntries(Object.entries(form).filter(([k]) => k !== "id"));
      await updateDocument("legends", id!, data);
      navigate("/admin/legends");
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
      label: "Legenda",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="ID" value={form.id ?? ""} onChange={() => {}} disabled />
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
      title={`Upravit: ${form.title ?? id}`}
      tabs={tabs}
      onSubmit={handleSave}
      onCancel={() => navigate("/admin/legends")}
      saving={saving}
    />
  );
};

export default LegendEditPage;
