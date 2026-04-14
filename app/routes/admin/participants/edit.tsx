import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { doc, query, where, type DocumentReference } from "firebase/firestore";
import { useDocumentData, useCollectionData } from "@/lib/firestore-hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, typedCollection } from "@/lib/firebase";
import { updateDocument, fetchParticipantPrivate, removeParticipant } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, ToggleField } from "@/components/admin/FormFields";
import { RHFInput, RHFSelect } from "@/components/admin/RHFFields";
import { participantSchema, type ParticipantFormValues } from "@/lib/schemas";
import type { Event, Participant, Race } from "@/lib/types";

const ParticipantEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [participant, loading] = useDocumentData<Participant>(
    doc(db, "participants", id!) as DocumentReference<Participant>,
  );
  const [privateData, setPrivateData] = useState<{ age?: number; email?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset, watch, setValue } = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
    shouldUnregister: false,
  });

  const eventId = watch("event") ?? participant?.event ?? "";

  // Load races filtered by participant's event
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
    if (participant) reset({ ...participant } as ParticipantFormValues);
  }, [participant, reset]);

  useEffect(() => {
    if (id) {
      fetchParticipantPrivate(id).then(setPrivateData);
    }
  }, [id]);

  const onValid = async (data: ParticipantFormValues) => {
    setSaving(true);
    try {
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
    const firstName = watch("firstName");
    const lastName = watch("lastName");
    if (!confirm(`Opravdu smazat účastníka „${firstName ?? ""} ${lastName ?? ""}"?`)) return;
    try {
      await removeParticipant(id!);
      navigate("/admin/participants");
    } catch (err) {
      alert("Chyba při mazání");
      console.error(err);
    }
  };

  if (loading) return <div className="text-gray-500">Načítání…</div>;
  if (!participant) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-500">
        <p>Účastník nenalezen</p>
        <Link to="/admin/participants" className="text-sm text-secondary hover:text-secondary-dark transition-colors">
          Zpět na seznam účastníků
        </Link>
      </div>
    );
  }

  const firstName = watch("firstName");
  const lastName = watch("lastName");

  const tabs = [
    {
      key: "main",
      label: "Účastník",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="ID" value={id ?? ""} onChange={() => {}} disabled />
            <InputField label="Událost" value={eventId} onChange={() => {}} disabled />
            <RHFInput control={control} name="firstName" label="Jméno" required />
            <RHFInput control={control} name="lastName" label="Příjmení" required />
            <RHFInput control={control} name="nickName" label="Přezdívka" />
            <RHFInput control={control} name="group" label="Skupina" />
            <RHFSelect
              control={control}
              name="race"
              label="Strana"
              required
              placeholder="Vyberte"
              options={(races ?? []).map((r) => ({ value: r.id, label: r.name }))}
            />
            <RHFInput control={control} name="note" label="Poznámka" />
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
                          checked={!!watch(fieldId)}
                          onChange={(v) => setValue(fieldId, v)}
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
                          value={String(watch(fieldId) ?? "")}
                          onChange={(v) => setValue(fieldId, extra.type === "number" ? Number(v) : v)}
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
      title={`Upravit: ${firstName ?? ""} ${lastName ?? ""}`}
      tabs={tabs}
      onSubmit={handleSubmit(onValid)}
      onCancel={() => navigate("/admin/participants")}
      onDelete={handleDelete}
      saving={saving}
    />
  );
};

export default ParticipantEditPage;
