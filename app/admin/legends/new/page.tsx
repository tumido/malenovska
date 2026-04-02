"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, ImageField } from "@/components/admin/FormFields";
import { useEventFilter } from "../../_components/EventFilter";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import type { Legend } from "@/lib/types";
import { Timestamp } from "firebase/firestore";

function slugify(title: string): string {
  return title.replace(/ /g, "_").toLowerCase().replace(/\W/g, "");
}

export default function LegendCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Legend>>({});
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);

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
      router.push("/admin/legends");
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Událost</label>
              <select
                value={form.event ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, event: e.target.value }))}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
      title="Nová legenda"
      tabs={tabs}
      onSubmit={handleSave}
      onCancel={() => router.push("/admin/legends")}
      saving={saving}
    />
  );
}
