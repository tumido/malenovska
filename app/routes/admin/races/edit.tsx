import { useParams, Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/admin/FormLayout";
import { InputField } from "@/components/admin/FormFields";
import { RHFInput, RHFEventSelect, RHFColor, RHFMarkdown, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { useAdminForm } from "@/lib/useAdminForm";
import { raceSchema, type RaceFormValues } from "@/lib/schemas";

const RaceEditPage = () => {
  const { id } = useParams();
  const { events } = useEventFilter([]);

  const { control, watch, onSubmit, onCancel, onDelete, loading, notFound, saving } =
    useAdminForm<RaceFormValues>({
      resolver: zodResolver(raceSchema),
      collection: "races",
      basePath: "/admin/races",
      defaultValues: {},
      id,
    });

  const name = watch("name");

  if (loading) return <div className="text-gray-500">Načítání…</div>;
  if (notFound) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-500">
        <p>Strana nenalezena</p>
        <Link to="/admin/races" className="text-sm text-secondary hover:text-secondary-dark transition-colors">
          Zpět na seznam stran
        </Link>
      </div>
    );
  }

  const tabs = [
    {
      key: "main",
      label: "Strana",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="ID" value={id ?? ""} onChange={() => {}} disabled />
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
      title={`Upravit: ${name ?? id}`}
      tabs={tabs}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={() => onDelete?.(name ?? id)}
      saving={saving}
    />
  );
};

export default RaceEditPage;
