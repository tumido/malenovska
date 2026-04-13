import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDocument, processPendingUploads } from "@/lib/admin-firestore";
import EventFormTabs from "@/components/admin/EventFormTabs";
import { useCloneData } from "@/lib/useCloneData";
import { eventSchema, type EventFormValues } from "@/lib/schemas";
import type { Event } from "@/lib/types";

const EventCreatePage = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset, setValue, watch } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    shouldUnregister: false,
    defaultValues: {
      id: "",
      name: "",
      display: false,
      registrationAvailable: false,
      type: true,
      year: new Date().getFullYear(),
      price: 0,
      description: "",
      rules: "",
      poi: [],
      registrationExtras: [],
      registrationBeforeAbove: "",
      registrationBeforeBelow: "",
      registrationAfter: "",
      registrationList: "",
      contactText: "",
      emailSubject: "",
      emailBody: "",
      emailUnder18: "",
    },
  });

  const resetStable = useCallback((data: Partial<Event>) => reset(data as EventFormValues), [reset]);
  const { isClone } = useCloneData<Event>("events", resetStable);

  const onValid = async (data: EventFormValues) => {
    setSaving(true);
    try {
      const { id, ...raw } = data;
      const processed = await processPendingUploads(raw);
      await createDocument("events", id, processed);
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
      control={control}
      setValue={setValue}
      watch={watch}
      onSave={handleSubmit(onValid)}
      onCancel={() => navigate("/admin/events")}
      saving={saving}
      title={isClone ? "Klonovat událost" : "Nová událost"}
    />
  );
};

export default EventCreatePage;
