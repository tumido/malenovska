import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { doc, type DocumentReference } from "firebase/firestore";
import { useDocumentData } from "@/lib/firestore-hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/lib/firebase";
import { updateDocument, removeDocument, processPendingUploads } from "@/lib/admin-firestore";
import EventFormTabs from "@/components/admin/EventFormTabs";
import { eventSchema, type EventFormValues } from "@/lib/schemas";
import type { Event } from "@/lib/types";

const EventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, loading] = useDocumentData<Event>(
    doc(db, "events", id!) as DocumentReference<Event>,
  );
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset, setValue, watch } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    shouldUnregister: false,
  });

  useEffect(() => {
    if (event) reset({ ...event, id } as EventFormValues);
  }, [event, id, reset]);

  const name = watch("name");

  const onValid = async (data: EventFormValues) => {
    setSaving(true);
    try {
      const { id: _id, ...raw } = data;
      const processed = await processPendingUploads(raw);
      await updateDocument("events", id!, processed);
      navigate("/admin/events");
    } catch (err) {
      alert("Chyba při ukládání");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Opravdu smazat událost „${name ?? id}"?`)) return;
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

  if (!event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-500">
        <p>Událost nenalezena</p>
        <Link to="/admin/events" className="text-sm text-secondary hover:text-secondary-dark transition-colors">
          Zpět na seznam událostí
        </Link>
      </div>
    );
  }

  return (
    <EventFormTabs
      control={control}
      setValue={setValue}
      watch={watch}
      onSave={handleSubmit(onValid)}
      onCancel={() => navigate("/admin/events")}
      onDelete={handleDelete}
      saving={saving}
      title={`Upravit: ${name ?? id}`}
      isEdit
    />
  );
};

export default EventEditPage;
