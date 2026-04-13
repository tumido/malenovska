import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { doc, type DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/lib/firebase";
import { updateDocument, removeDocument, processPendingUploads } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField } from "@/components/admin/FormFields";
import { RHFInput, RHFEventSelect, RHFColor, RHFMarkdown, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { raceSchema, type RaceFormValues } from "@/lib/schemas";
import type { Race } from "@/lib/types";

const RaceEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [race, loading] = useDocumentData<Race>(
    doc(db, "races", id!) as DocumentReference<Race>,
  );
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);

  const { control, handleSubmit, reset, watch } = useForm<RaceFormValues>({
    resolver: zodResolver(raceSchema),
    shouldUnregister: false,
  });

  useEffect(() => {
    if (race) reset(race as RaceFormValues);
  }, [race, reset]);

  const name = watch("name");

  const onValid = async (data: RaceFormValues) => {
    setSaving(true);
    try {
      const processed = await processPendingUploads(data);
      await updateDocument("races", id!, processed);
      navigate("/admin/races");
    } catch (err) {
      alert("Chyba při ukládání");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Opravdu smazat stranu „${name ?? id}"?`)) return;
    try {
      await removeDocument("races", id!);
      navigate("/admin/races");
    } catch (err) {
      alert("Chyba při mazání");
      console.error(err);
    }
  };

  if (loading) return <div className="text-gray-500">Načítání…</div>;
  if (!race) {
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
      onSubmit={handleSubmit(onValid)}
      onCancel={() => navigate("/admin/races")}
      onDelete={handleDelete}
      saving={saving}
    />
  );
};

export default RaceEditPage;
