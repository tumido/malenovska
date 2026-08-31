import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { httpsCallable } from "firebase/functions";
import { doc, type DocumentReference } from "firebase/firestore";
import { useDocumentData } from "@/lib/firestore-hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, functions } from "@/lib/firebase";
import { updateDocument, removeDocument, processPendingUploads } from "@/lib/admin-firestore";
import EventFormTabs from "@/components/admin/EventFormTabs";
import { eventSchema, type EventFormValues } from "@/lib/schemas";
import type { Event } from "@/lib/types";

interface SendTestEmailRequest {
  eventId: string;
  eventName?: string;
  eventYear?: number;
  eventDate?: string;
  emailSubject?: string;
  emailBody?: string;
  emailUnder18?: string;
}

interface SendTestEmailResponse {
  recipient: string;
}

const sendTestEmail = httpsCallable<SendTestEmailRequest, SendTestEmailResponse>(
  functions,
  "sendTestEmail",
);

const formatEmailDate = (value: unknown): string | undefined => {
  if (value instanceof Date) {
    return value.toLocaleDateString("cs-CZ");
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    const date = (value as { toDate: () => unknown }).toDate();
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("cs-CZ");
    }
  }

  if (typeof value === "string") {
    const date = new Date(`${value}T00:00:00`);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("cs-CZ");
    }
  }

  return undefined;
};

const EventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, loading] = useDocumentData<Event>(
    doc(db, "events", id!) as DocumentReference<Event>,
  );
  const [saving, setSaving] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  const { control, getValues, handleSubmit, reset, setValue, watch } = useForm<EventFormValues>({
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

  const handleTestEmail = async () => {
    const data = getValues();

    if (!data.emailSubject?.trim() || !data.emailBody?.trim()) {
      alert("Před odesláním vyplňte předmět a tělo e-mailu.");
      return;
    }

    setSendingTestEmail(true);
    try {
      const result = await sendTestEmail({
        eventId: id!,
        eventName: data.name,
        eventYear: data.year,
        eventDate: formatEmailDate(data.date),
        emailSubject: data.emailSubject,
        emailBody: data.emailBody,
        emailUnder18: data.emailUnder18 ?? "",
      });
      alert(`Testovací e-mail byl odeslán na ${result.data.recipient}.`);
    } catch (err) {
      const message = err instanceof Error && err.message ? `: ${err.message}` : "";
      alert(`Chyba při odesílání testovacího e-mailu${message}`);
      console.error(err);
    } finally {
      setSendingTestEmail(false);
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
      onTestEmail={handleTestEmail}
      saving={saving}
      testingEmail={sendingTestEmail}
      title={`Upravit: ${name ?? id}`}
      isEdit
    />
  );
};

export default EventEditPage;
