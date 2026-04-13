import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { doc, query, where, type DocumentReference } from "firebase/firestore";
import { useDocumentData, useCollectionData } from "react-firebase-hooks/firestore";
import { db, typedCollection } from "@/lib/firebase";
import { updateDocument, fetchParticipantPrivate, removeParticipant } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, ToggleField } from "@/components/admin/FormFields";
import type { Event, Participant, Race } from "@/lib/types";

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
  const [event] = useDocumentData<Event>(
    eventId ? (doc(db, "events", eventId) as DocumentReference<Event>) : null,
  );

  const fieldExtras = event?.registrationExtras?.filter(
    (e) => (e.type === "checkbox" || e.type === "text" || e.type === "number") && e.props?.id,
  ) ?? [];

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

  const handleDelete = async () => {
    if (!confirm(`Opravdu smazat účastníka „${form.firstName ?? ""} ${form.lastName ?? ""}"?`)) return;
    try {
      await removeParticipant(id!);
      navigate("/admin/participants");
    } catch (err) {
      alert("Chyba při mazání");
      console.error(err);
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
          {fieldExtras.length > 0 && (() => {
            const checkboxes = fieldExtras.filter((e) => e.type === "checkbox");
            const inputs = fieldExtras.filter((e) => e.type !== "checkbox");
            return (
              <div className="mt-2 rounded-lg border border-gray-700 bg-neutral-900 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wide">Doplňující údaje</h3>
                {checkboxes.length > 0 && (
                  <div className="space-y-2">
                    {checkboxes.map((extra) => {
                      const fieldId = extra.props!.id!;
                      const label = extra.props!.label ?? fieldId;
                      return (
                        <ToggleField
                          key={fieldId}
                          label={label}
                          checked={!!form[fieldId]}
                          onChange={(v) => set({ [fieldId]: v })}
                        />
                      );
                    })}
                  </div>
                )}
                {inputs.length > 0 && (
                  <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${checkboxes.length > 0 ? "mt-4" : ""}`}>
                    {inputs.map((extra) => {
                      const fieldId = extra.props!.id!;
                      const label = extra.props!.label ?? fieldId;
                      return (
                        <InputField
                          key={fieldId}
                          label={label}
                          value={String(form[fieldId] ?? "")}
                          onChange={(v) => set({ [fieldId]: extra.type === "number" ? Number(v) : v })}
                          type={extra.type}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Private data — read-only */}
          <div className="mt-6 rounded-lg border border-gray-700 bg-neutral-900 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wide">Soukromé údaje</h3>
            {privateData ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-0.5">Věk</label>
                  <p className="text-sm text-primary-light">{privateData.age ?? "–"}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-0.5">E-mail</label>
                  <p className="text-sm text-primary-light">{privateData.email ?? "–"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Žádná soukromá data</p>
            )}
          </div>
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
      onDelete={handleDelete}
      saving={saving}
    />
  );
};

export default ParticipantEditPage;
