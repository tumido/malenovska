import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDocument, processPendingUploads, DocumentExistsError } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { RHFInput, RHFEventSelect, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { useCloneData } from "@/lib/useCloneData";
import { gallerySchema, type GalleryFormValues } from "@/lib/schemas";
import type { Gallery } from "@/lib/types";

const slugify = (name: string): string => {
  return name.replace(/ /g, "_").toLowerCase().replace(/\W/g, "");
};

const GalleryCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);

  const { control, handleSubmit, reset } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    shouldUnregister: false,
    defaultValues: {
      name: "",
      event: searchParams.get("event") ?? "",
      author: "",
      url: "",
      cover: { src: "" },
    },
  });

  const resetStable = useCallback((data: Partial<Gallery>) => reset(data as GalleryFormValues), [reset]);
  const { isClone } = useCloneData<Gallery>("galleries", resetStable);

  const onValid = async (data: GalleryFormValues) => {
    setSaving(true);
    try {
      const id = slugify(data.name);
      const processed = await processPendingUploads(data);
      await createDocument("galleries", id, processed);
      navigate("/admin/galleries");
    } catch (err) {
      if (err instanceof DocumentExistsError) {
        alert(`Galerie s ID "${err.documentId}" již existuje.`);
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
      label: "Galerie",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RHFInput control={control} name="name" label="Název" required />
            <RHFEventSelect control={control} name="event" label="Událost" events={events} required />
          </div>
          <RHFInput control={control} name="author" label="Autor" required />
          <RHFInput control={control} name="url" label="URL galerie" type="url" required />
          <RHFImage control={control} name="cover" label="Náhledový obrázek" required />
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title={isClone ? "Klonovat galerii" : "Nová galerie"}
      tabs={tabs}
      onSubmit={handleSubmit(onValid)}
      onCancel={() => navigate("/admin/galleries")}
      saving={saving}
    />
  );
};

export default GalleryCreatePage;
