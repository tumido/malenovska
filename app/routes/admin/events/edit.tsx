import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { doc, type DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { updateDocument, removeDocument, processPendingUploads } from "@/lib/admin-firestore";
import EventFormTabs from "@/components/admin/EventFormTabs";
import type { Event } from "@/lib/types";

const EventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, loading] = useDocumentData<Event>(
    doc(db, "events", id!) as DocumentReference<Event>,
  );
  const [form, setForm] = useState<Partial<Event>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event && Object.keys(form).length === 0) {
      setForm({ ...event, id });
    }
  }, [event, id, form]);

  const update = (key: keyof Event, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const raw = Object.fromEntries(Object.entries(form).filter(([k]) => k !== "id"));
      const data = await processPendingUploads(raw);
      await updateDocument("events", id!, data);
      navigate("/admin/events");
    } catch (err) {
      alert("Chyba při ukládání");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Opravdu smazat událost „${form.name ?? id}"?`)) return;
    try {
      await removeDocument("events", id!);
      navigate("/admin/events");
    } catch (err) {
      alert("Chyba při mazání");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Načítání…</div>;
  }

  return (
    <EventFormTabs
      form={form}
      update={update}
      onSave={handleSave}
      onCancel={() => navigate("/admin/events")}
      onDelete={handleDelete}
      saving={saving}
      title={`Upravit: ${form.name ?? id}`}
      isEdit
    />
  );
};

export default EventEditPage;
