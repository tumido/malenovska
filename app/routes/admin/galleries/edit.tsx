import { useParams, Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/admin/FormLayout";
import { InputField } from "@/components/admin/FormFields";
import { RHFInput, RHFEventSelect, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { useAdminForm } from "@/lib/useAdminForm";
import { gallerySchema, type GalleryFormValues } from "@/lib/schemas";

const GalleryEditPage = () => {
  const { id } = useParams();
  const { events } = useEventFilter([]);

  const { control, watch, onSubmit, onCancel, onDelete, loading, notFound, saving } =
    useAdminForm<GalleryFormValues>({
      resolver: zodResolver(gallerySchema),
      collection: "galleries",
      basePath: "/admin/galleries",
      defaultValues: {},
      id,
    });

  const name = watch("name");

  if (loading) return <div className="text-gray-500">Načítání…</div>;
  if (notFound) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-500">
        <p>Galerie nenalezena</p>
        <Link to="/admin/galleries" className="text-sm text-secondary hover:text-secondary-dark transition-colors">
          Zpět na seznam galerií
        </Link>
      </div>
    );
  }

  const tabs = [
    {
      key: "main",
      label: "Galerie",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="ID" value={id ?? ""} onChange={() => {}} disabled />
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
      title={`Upravit: ${name ?? id}`}
      tabs={tabs}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={() => onDelete?.(name ?? id)}
      saving={saving}
    />
  );
};

export default GalleryEditPage;
