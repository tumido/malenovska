"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createDocument } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, ImageField } from "@/components/admin/FormFields";
import { useEventFilter } from "../../_components/EventFilter";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { useCloneData } from "@/lib/useCloneData";
import type { Race } from "@/lib/types";

const RaceCreatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<Partial<Race>>(() => {
    const event = searchParams.get("event");
    return { priority: 1, ...(event ? { event } : {}) };
  });
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);
  const setFormStable = useCallback((data: Partial<Race>) => setForm(data), []);
  const { isClone } = useCloneData<Race>("races", setFormStable);

  const set = (patch: Partial<Race>) => setForm((p) => ({ ...p, ...patch }));

  const handleSave = async () => {
    if (!form.name || !form.event) {
      alert("Vyplňte název a událost");
      return;
    }
    setSaving(true);
    try {
      const id = form.name.replace(/ /g, "_").toLowerCase().replace(/\W/g, "");
      const data = Object.fromEntries(Object.entries(form).filter(([k]) => k !== "id"));
      await createDocument("races", id, data);
      router.push("/admin/races");
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
      label: "Strana",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="Název" value={form.name ?? ""} onChange={(v) => set({ name: v })} required />
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
      title={isClone ? "Klonovat stranu" : "Nová strana"}
      tabs={tabs}
      onSubmit={handleSave}
      onCancel={() => router.push("/admin/races")}
      saving={saving}
    />
  );
};

export default RaceCreatePage;
