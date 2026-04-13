import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { doc, orderBy, query, setDoc, type DocumentReference } from "firebase/firestore";
import { useDocumentData, useCollectionData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, typedCollection } from "@/lib/firebase";
import { RHFSelect } from "@/components/admin/RHFFields";
import { configSchema, type ConfigFormValues } from "@/lib/schemas";
import type { Config, Event } from "@/lib/types";

const ConfigPage = () => {
  const navigate = useNavigate();
  const [config, loading] = useDocumentData<Config>(
    doc(db, "config", "config") as DocumentReference<Config>,
  );
  const [events] = useCollectionData(
    query(typedCollection<Event>("events"), orderBy("year", "desc")),
  );
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset } = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: { event: "" },
  });

  useEffect(() => {
    if (config) reset({ event: config.event });
  }, [config, reset]);

  const onValid = async (data: ConfigFormValues) => {
    setSaving(true);
    try {
      await setDoc(doc(db, "config", "config"), { event: data.event });
      navigate("/admin");
    } catch (err) {
      alert("Chyba při ukládání");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">Načítání…</div>;

  return (
    <div className="max-w-lg space-y-6">
      <div className="rounded-lg border border-gray-700 bg-neutral-800 p-6 space-y-4">
        <RHFSelect
          control={control}
          name="event"
          label="Aktivní událost"
          required
          placeholder="Vyberte událost"
          options={(events ?? []).map((ev) => ({ value: ev.id, label: `${ev.name} (${ev.year})` }))}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit(onValid)}
          disabled={saving}
          className="rounded bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary-dark disabled:opacity-50 transition-colors"
        >
          {saving ? "Ukládání…" : "Uložit"}
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="rounded border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Zrušit
        </button>
      </div>
    </div>
  );
};

export default ConfigPage;
