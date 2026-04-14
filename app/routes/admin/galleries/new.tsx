import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/admin/FormLayout";
import { RHFInput, RHFEventSelect, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { useAdminForm } from "@/lib/useAdminForm";
import { gallerySchema, type GalleryFormValues } from "@/lib/schemas";

const GalleryCreatePage = () => {
  const { events } = useEventFilter([]);

  const { control, onSubmit, onCancel, isClone, saving } = useAdminForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    collection: "galleries",
    basePath: "/admin/galleries",
    slugField: "name",
    defaultValues: {
      name: "",
      event: new URLSearchParams(window.location.search).get("event") ?? "",
      author: "",
      url: "",
      cover: { src: "" },
    },
  });

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
      onSubmit={onSubmit}
      onCancel={onCancel}
      saving={saving}
    />
  );
};

export default GalleryCreatePage;
