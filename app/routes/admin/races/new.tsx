import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDocument, processPendingUploads, DocumentExistsError } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { RHFInput, RHFEventSelect, RHFColor, RHFMarkdown, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { useCloneData } from "@/lib/useCloneData";
import { raceSchema, type RaceFormValues } from "@/lib/schemas";
import type { Race } from "@/lib/types";

const slugify = (name: string): string => {
  return name.replace(/ /g, "_").toLowerCase().replace(/\W/g, "");
};

const RaceCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);

  const { control, handleSubmit, reset } = useForm<RaceFormValues>({
    resolver: zodResolver(raceSchema),
    shouldUnregister: false,
    defaultValues: {
      name: "",
      event: searchParams.get("event") ?? "",
      limit: 0,
      priority: 1,
      color: "",
      colorName: "",
      legend: "",
      requirements: "",
      image: { src: "" },
    },
  });

  const resetStable = useCallback((data: Partial<Race>) => reset(data as RaceFormValues), [reset]);
  const { isClone } = useCloneData<Race>("races", resetStable);

  const onValid = async (data: RaceFormValues) => {
    setSaving(true);
    try {
      const id = slugify(data.name);
      const processed = await processPendingUploads(data);
      await createDocument("races", id, processed);
      navigate("/admin/races");
    } catch (err) {
      if (err instanceof DocumentExistsError) {
        alert(`Strana s ID "${err.documentId}" již existuje.`);
      } else {
        alert("Chyba při vytváření");
        console.error(err);
      }
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
            <RHFInput control={control} name="name" label="Název" required />
            <RHFEventSelect control={control} name="event" label="Událost" events={events} required />
            <RHFInput control={control} name="limit" label="Limit" type="number" required />
            <RHFInput control={control} name="priority" label="Priorita" type="number" required />
            <RHFColor control={control} name="color" label="Barva" required />
            <RHFInput control={control} name="colorName" label="Název barvy" required />
          </div>
          <RHFMarkdown control={control} name="legend" label="Legenda" required />
          <RHFMarkdown control={control} name="requirements" label="Požadavky" required />
          <RHFImage control={control} name="image" label="Obrázek" required />
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title={isClone ? "Klonovat stranu" : "Nová strana"}
      tabs={tabs}
      onSubmit={handleSubmit(onValid)}
      onCancel={() => navigate("/admin/races")}
      saving={saving}
    />
  );
};

export default RaceCreatePage;
