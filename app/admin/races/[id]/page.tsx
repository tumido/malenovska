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
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import type { Race } from "@/lib/types";

const RaceEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [race, loading] = useDocumentData<Race>(
    doc(db, "races", id) as DocumentReference<Race>,
  );
  const [form, setForm] = useState<Partial<Race>>({});
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);

  useEffect(() => {
    if (race && Object.keys(form).length === 0) {
      setForm({ ...race, id });
    }
  }, [race, id, form]);

  const set = (patch: Partial<Race>) => setForm((p) => ({ ...p, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = Object.fromEntries(Object.entries(form).filter(([k]) => k !== "id"));
      await updateDocument("races", id, data);
      router.push("/admin/races");
    } catch (err) {
      alert("Chyba při ukládání");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-400">Načítání…</div>;

  const tabs = [
    {
      key: "main",
      label: "Strana",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="Název" value={form.name ?? ""} onChange={(v) => set({ name: v })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Událost</label>
              <select
                value={form.event ?? ""}
                onChange={(e) => set({ event: e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Vyberte</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.name} ({ev.year})</option>
                ))}
              </select>
            </div>
            <InputField label="Limit" value={form.limit ?? 0} onChange={(v) => set({ limit: Number(v) })} type="number" required />
            <InputField label="Priorita" value={form.priority ?? 1} onChange={(v) => set({ priority: Number(v) })} type="number" />
            <InputField label="Barva (hex)" value={form.color ?? ""} onChange={(v) => set({ color: v })} />
            <InputField label="Název barvy" value={form.colorName ?? ""} onChange={(v) => set({ colorName: v })} required />
          </div>
          <MarkdownEditor label="Legenda" value={form.legend ?? ""} onChange={(v) => set({ legend: v })} />
          <MarkdownEditor label="Požadavky" value={form.requirements ?? ""} onChange={(v) => set({ requirements: v })} />
          <ImageField label="Obrázek" value={form.image ?? { src: "" }} onChange={(v) => set({ image: v })} />
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title={`Upravit: ${form.name ?? id}`}
      tabs={tabs}
      onSubmit={handleSave}
      onCancel={() => router.push("/admin/races")}
      saving={saving}
    />
  );
};

export default RaceEditPage;
