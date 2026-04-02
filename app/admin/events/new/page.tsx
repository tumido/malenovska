"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument } from "@/lib/admin-firestore";
import EventFormTabs from "../[id]/EventFormTabs";
import type { Event } from "@/lib/types";

export default function EventCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Event>>({
    display: false,
    registrationAvailable: false,
    type: true,
    year: new Date().getFullYear(),
    poi: [],
    registrationExtras: [],
  });
  const [saving, setSaving] = useState(false);

  const update = (key: keyof Event, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.id || !form.name) {
      alert("Vyplňte ID a název");
      return;
    }
    setSaving(true);
    try {
      const { id, ...data } = form;
      await createDocument("events", id!, data);
      router.push("/admin/events");
    } catch (err) {
      alert("Chyba při vytváření");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <EventFormTabs
      form={form}
      update={update}
      onSave={handleSave}
      onCancel={() => router.push("/admin/events")}
      saving={saving}
      title="Nová událost"
    />
  );
}
