import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { httpsCallable } from "firebase/functions";
import { doc, query, where, type DocumentReference } from "firebase/firestore";
import { useDocumentData, useCollectionData } from "@/lib/firestore-hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, functions, typedCollection } from "@/lib/firebase";
import { updateDocument, fetchParticipantPrivate, removeParticipant } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { InputField, ToggleField } from "@/components/admin/FormFields";
import { RHFInput, RHFSelect } from "@/components/admin/RHFFields";
import { participantSchema, type ParticipantFormValues } from "@/lib/schemas";
import type {
  Event,
  Participant,
  ParticipantNotification,
  ParticipantPrivate,
  Race,
} from "@/lib/types";

type RetryNotificationResponse = Pick<
  ParticipantNotification,
  "status" | "email" | "discord" | "error"
>;

const retryAttendeeNotification = httpsCallable<
  { participantId: string },
  RetryNotificationResponse
>(functions, "retryAttendeeNotification");

const notificationStatusLabels: Record<ParticipantNotification["status"], string> = {
  pending: "Čeká na odeslání",
  sent: "Odesláno",
  partial: "Částečně odesláno",
  failed: "Selhalo",
  skipped: "Přeskočeno",
};

const channelStatusLabels: Record<ParticipantNotification["email"], string> = {
  pending: "čeká",
  sent: "odesláno",
  failed: "selhalo",
  skipped: "přeskočeno",
};

const notificationStatusClass = (status: ParticipantNotification["status"]) => {
  if (status === "sent") return "text-green-400";
  if (status === "partial") return "text-yellow-400";
  if (status === "failed") return "text-red-400";
  if (status === "skipped") return "text-gray-400";
  return "text-yellow-400";
};

const formatDateTime = (value: unknown): string => {
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    const date = (value as { toDate: () => unknown }).toDate();
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date.toLocaleString("cs-CZ");
    }
  }
  return "–";
};

const ParticipantEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [participant, loading] = useDocumentData<Participant>(
    doc(db, "participants", id!) as DocumentReference<Participant>,
  );
  const [privateData, setPrivateData] = useState<ParticipantPrivate | null>(null);
  const [privateLoading, setPrivateLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [retryingNotification, setRetryingNotification] = useState(false);

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
    if (!id) return;

    let active = true;
    setPrivateLoading(true);
    fetchParticipantPrivate(id)
      .then((data) => {
        if (active) setPrivateData(data);
      })
      .catch((err) => {
        console.error(err);
        if (active) setPrivateData(null);
      })
      .finally(() => {
        if (active) setPrivateLoading(false);
      });

    return () => {
      active = false;
    };
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

  const handleRetryNotification = async () => {
    if (!id || !privateData?.email) return;
    const firstName = watch("firstName");
    const lastName = watch("lastName");
    if (!confirm(`Znovu odeslat e-mail a oznámení pro „${firstName ?? ""} ${lastName ?? ""}"?`)) return;

    setRetryingNotification(true);
    try {
      const response = await retryAttendeeNotification({ participantId: id });
      const refreshed = await fetchParticipantPrivate(id);
      setPrivateData(refreshed);

      const result = response.data;
      const details = result.error ? `\n${result.error}` : "";
      alert(`Oznámení: ${notificationStatusLabels[result.status]}.${details}`);
    } catch (err) {
      const message = err instanceof Error && err.message ? `: ${err.message}` : "";
      alert(`Chyba při opakovaném odesílání oznámení${message}`);
      console.error(err);
    } finally {
      setRetryingNotification(false);
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
            {privateLoading ? (
              <p className="text-sm text-gray-500">Načítání…</p>
            ) : privateData ? (
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

          <div className="mt-6 rounded-lg border border-gray-700 bg-neutral-900 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Oznámení registrace
              </h3>
              <button
                type="button"
                onClick={handleRetryNotification}
                disabled={privateLoading || !privateData?.email || retryingNotification}
                className="rounded border border-secondary px-3 py-1.5 text-xs font-medium text-secondary hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {retryingNotification ? "Odesílání…" : "Znovu odeslat oznámení"}
              </button>
            </div>

            {privateData?.notification ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Celkový stav</span>
                  <span className={`font-medium ${notificationStatusClass(privateData.notification.status)}`}>
                    {notificationStatusLabels[privateData.notification.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">E-mail</span>
                  <span className="text-primary-light">
                    {channelStatusLabels[privateData.notification.email]}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Discord</span>
                  <span className="text-primary-light">
                    {channelStatusLabels[privateData.notification.discord]}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Poslední pokus</span>
                  <span className="text-primary-light">
                    {formatDateTime(privateData.notification.attemptedAt)}
                  </span>
                </div>
                {privateData.notification.error && (
                  <p className="rounded border border-red-900/50 bg-red-950/30 p-2 text-xs text-red-300">
                    {privateData.notification.error}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Stav odeslání zatím není zaznamenán.</p>
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
