import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/admin/FormLayout";
import { RHFInput, RHFEventSelect, RHFColor, RHFMarkdown, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { useAdminForm } from "@/lib/useAdminForm";
import { raceSchema, type RaceFormValues } from "@/lib/schemas";

const RaceCreatePage = () => {
  const { events } = useEventFilter([]);

  const { control, onSubmit, onCancel, isClone, saving } = useAdminForm<RaceFormValues>({
    resolver: zodResolver(raceSchema),
    collection: "races",
    basePath: "/admin/races",
    slugField: "name",
    defaultValues: {
      name: "",
      event: new URLSearchParams(window.location.search).get("event") ?? "",
      limit: 0,
      priority: 1,
      color: "",
      colorName: "",
      legend: "",
      requirements: "",
      image: { src: "" },
    },
  });

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
      onSubmit={onSubmit}
      onCancel={onCancel}
      saving={saving}
    />
  );
};

export default RaceCreatePage;
