import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { createDocument } from "@/lib/admin-firestore";
import EventFormTabs from "@/components/admin/EventFormTabs";
import { useCloneData } from "@/lib/useCloneData";
import type { Event } from "@/lib/types";

const EventCreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Event>>({
    display: false,
    registrationAvailable: false,
    type: true,
    year: new Date().getFullYear(),
    poi: [],
    registrationExtras: [],
  });
  const [saving, setSaving] = useState(false);
  const setFormStable = useCallback((data: Partial<Event>) => setForm(data), []);
  const { isClone } = useCloneData<Event>("events", setFormStable);

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
      navigate("/admin/events");
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
      onCancel={() => navigate("/admin/events")}
      saving={saving}
      title={isClone ? "Klonovat událost" : "Nová událost"}
    />
  );
};

export default EventCreatePage;
