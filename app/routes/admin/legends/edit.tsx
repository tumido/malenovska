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
import { RHFInput, RHFEventSelect, RHFMarkdown, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { legendSchema, type LegendFormValues } from "@/lib/schemas";
import type { Legend } from "@/lib/types";

const LegendEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [legend, loading] = useDocumentData<Legend>(
    doc(db, "legends", id!) as DocumentReference<Legend>,
  );
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);

  const { control, handleSubmit, reset, watch } = useForm<LegendFormValues>({
    resolver: zodResolver(legendSchema),
    shouldUnregister: false,
  });

  useEffect(() => {
    if (legend) reset(legend as LegendFormValues);
  }, [legend, reset]);

  const title = watch("title");

  const onValid = async (data: LegendFormValues) => {
    setSaving(true);
    try {
      const processed = await processPendingUploads(data);
      await updateDocument("legends", id!, processed);
      navigate("/admin/legends");
    } catch (err) {
      alert("Chyba při ukládání");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Opravdu smazat legendu „${title ?? id}"?`)) return;
    try {
      await removeDocument("legends", id!);
      navigate("/admin/legends");
    } catch (err) {
      alert("Chyba při mazání");
      console.error(err);
    }
  };

  if (loading) return <div className="text-gray-500">Načítání…</div>;
  if (!legend) {
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
      onSubmit={handleSubmit(onValid)}
      onCancel={() => navigate("/admin/legends")}
      onDelete={handleDelete}
      saving={saving}
    />
  );
};

export default LegendEditPage;
