import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import { createDocument, processPendingUploads, DocumentExistsError } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { RHFInput, RHFEventSelect, RHFMarkdown, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { useCloneData } from "@/lib/useCloneData";
import { legendSchema, type LegendFormValues } from "@/lib/schemas";
import type { Legend } from "@/lib/types";

const slugify = (title: string): string => {
  return title.replace(/ /g, "_").toLowerCase().replace(/\W/g, "");
};

const LegendCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);

  const { control, handleSubmit, reset } = useForm<LegendFormValues>({
    resolver: zodResolver(legendSchema),
    shouldUnregister: false,
    defaultValues: {
      title: "",
      event: searchParams.get("event") ?? "",
      perex: "",
      content: "",
      image: { src: "" },
    },
  });

  const resetStable = useCallback((data: Partial<Legend>) => reset(data as LegendFormValues), [reset]);
  const { isClone } = useCloneData<Legend>("legends", resetStable);

  const onValid = async (data: LegendFormValues) => {
    setSaving(true);
    try {
      const id = slugify(data.title);
      const processed = await processPendingUploads({
        ...data,
        publishedAt: Timestamp.now(),
      });
      await createDocument("legends", id, processed);
      navigate("/admin/legends");
    } catch (err) {
      if (err instanceof DocumentExistsError) {
        alert(`Legenda s ID "${err.documentId}" již existuje.`);
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
      label: "Legenda",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RHFInput control={control} name="title" label="Název" required />
            <RHFEventSelect control={control} name="event" label="Událost" events={events} required />
          </div>
          <RHFInput control={control} name="perex" label="Perex" required maxLength={200} />
          <RHFMarkdown control={control} name="content" label="Obsah" required />
          <RHFImage control={control} name="image" label="Obrázek" required />
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title={isClone ? "Klonovat legendu" : "Nová legenda"}
      tabs={tabs}
      onSubmit={handleSubmit(onValid)}
      onCancel={() => navigate("/admin/legends")}
      saving={saving}
    />
  );
};

export default LegendCreatePage;
