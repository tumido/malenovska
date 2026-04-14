import { Timestamp } from "firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/admin/FormLayout";
import { RHFInput, RHFEventSelect, RHFMarkdown, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { useAdminForm } from "@/lib/useAdminForm";
import { legendSchema, type LegendFormValues } from "@/lib/schemas";

const LegendCreatePage = () => {
  const { events } = useEventFilter([]);

  const { control, onSubmit, onCancel, isClone, saving } = useAdminForm<LegendFormValues>({
    resolver: zodResolver(legendSchema),
    collection: "legends",
    basePath: "/admin/legends",
    slugField: "title",
    defaultValues: {
      title: "",
      event: new URLSearchParams(window.location.search).get("event") ?? "",
      perex: "",
      content: "",
      image: { src: "" },
    },
    extraCreateData: () => ({ publishedAt: Timestamp.now() }),
  });

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
      onSubmit={onSubmit}
      onCancel={onCancel}
      saving={saving}
    />
  );
};

export default LegendCreatePage;
