import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { doc, query, where, type DocumentReference } from "firebase/firestore";
import { useDocumentData, useCollectionData } from "react-firebase-hooks/firestore";
import { db, typedCollection } from "@/lib/firebase";
import { updateDocument, fetchParticipantPrivate } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, CheckboxField } from "@/components/admin/FormFields";
import type { Participant, Race } from "@/lib/types";

const ParticipantEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [participant, loading] = useDocumentData<Participant>(
    doc(db, "participants", id!) as DocumentReference<Participant>,
  );
  const [form, setForm] = useState<Partial<Participant>>({});
  const [privateData, setPrivateData] = useState<{ age?: number; email?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Load races filtered by participant's event
  const eventId = form.event ?? participant?.event ?? "";
  const [races] = useCollectionData(
    eventId
      ? query(typedCollection<Race>("races"), where("event", "==", eventId))
      : null,
  );

  useEffect(() => {
    if (participant && Object.keys(form).length === 0) {
      setForm({ ...participant, id });
    }
  }, [participant, id, form]);

  useEffect(() => {
    if (id) {
      fetchParticipantPrivate(id).then(setPrivateData);
    }
  }, [id]);

  const set = (patch: Partial<Participant>) => setForm((p) => ({ ...p, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = Object.fromEntries(Object.entries(form).filter(([k]) => k !== "id"));
      await updateDocument("participants", id!, data);
      navigate("/admin/participants");
    } catch (err) {
      alert("Chyba při ukládání");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">Načítání…</div>;

  const tabs = [
    {
      key: "main",
      label: "Účastník",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="ID" value={form.id ?? ""} onChange={() => {}} disabled />
            <InputField label="Událost" value={form.event ?? ""} onChange={() => {}} disabled />
            <InputField label="Jméno" value={form.firstName ?? ""} onChange={(v) => set({ firstName: v })} required />
            <InputField label="Příjmení" value={form.lastName ?? ""} onChange={(v) => set({ lastName: v })} required />
            <InputField label="Přezdívka" value={form.nickName ?? ""} onChange={(v) => set({ nickName: v })} />
            <InputField label="Skupina" value={form.group ?? ""} onChange={(v) => set({ group: v })} />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Strana</label>
              <select
                value={form.race ?? ""}
                onChange={(e) => set({ race: e.target.value })}
                className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                <option value="">Vyberte</option>
                {(races ?? []).map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <InputField label="Poznámka" value={form.note ?? ""} onChange={(v) => set({ note: v })} />
          </div>
          <div className="flex gap-6">
            <CheckboxField label="Afterparty" checked={form.afterparty ?? false} onChange={(v) => set({ afterparty: v })} />
            <CheckboxField label="Přespání" checked={form.sleepover ?? false} onChange={(v) => set({ sleepover: v })} />
          </div>
        </div>
      ),
    },
    {
      key: "private",
      label: "Soukromé údaje",
      content: (
        <div className="space-y-4">
          {privateData ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Věk</label>
                <p className="text-sm text-primary-light">{privateData.age ?? "–"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                <p className="text-sm text-primary-light">{privateData.email ?? "–"}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Žádná soukromá data</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title={`Upravit: ${form.firstName ?? ""} ${form.lastName ?? ""}`}
      tabs={tabs}
      onSubmit={handleSave}
      onCancel={() => navigate("/admin/participants")}
      saving={saving}
    />
  );
};

export default ParticipantEditPage;
