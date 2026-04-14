import { useParams, Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/admin/FormLayout";
import { InputField } from "@/components/admin/FormFields";
import { RHFInput, RHFEventSelect, RHFMarkdown, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { useAdminForm } from "@/lib/useAdminForm";
import { legendSchema, type LegendFormValues } from "@/lib/schemas";

const LegendEditPage = () => {
  const { id } = useParams();
  const { events } = useEventFilter([]);

  const { control, watch, onSubmit, onCancel, onDelete, loading, notFound, saving } =
    useAdminForm<LegendFormValues>({
      resolver: zodResolver(legendSchema),
      collection: "legends",
      basePath: "/admin/legends",
      defaultValues: {},
      id,
    });

  const title = watch("title");

  if (loading) return <div className="text-gray-500">Načítání…</div>;
  if (notFound) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-500">
        <p>Legenda nenalezena</p>
        <Link to="/admin/legends" className="text-sm text-secondary hover:text-secondary-dark transition-colors">
          Zpět na seznam legend
        </Link>
      </div>
    );
  }

  const tabs = [
    {
      key: "main",
      label: "Legenda",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="ID" value={id ?? ""} onChange={() => {}} disabled />
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
      title={`Upravit: ${title ?? id}`}
      tabs={tabs}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={() => onDelete?.(title ?? id)}
      saving={saving}
    />
  );
};

export default LegendEditPage;
