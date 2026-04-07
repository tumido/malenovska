"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, orderBy, query, setDoc, type DocumentReference } from "firebase/firestore";
import { useDocumentData, useCollectionData } from "react-firebase-hooks/firestore";
import { db, typedCollection } from "@/lib/firebase";
import type { Config, Event } from "@/lib/types";

const ConfigPage = () => {
  const router = useRouter();
  const [config, loading] = useDocumentData<Config>(
    doc(db, "config", "config") as DocumentReference<Config>,
  );
  const [events] = useCollectionData(
    query(typedCollection<Event>("events"), orderBy("year", "desc")),
  );
  const [eventId, setEventId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config && !eventId) {
      setEventId(config.event);
    }
  }, [config, eventId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "config", "config"), { event: eventId });
      router.push("/admin");
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
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Aktivní událost
          </label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            <option value="">Vyberte událost</option>
            {(events ?? []).map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name} ({ev.year})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary-dark disabled:opacity-50 transition-colors"
        >
          {saving ? "Ukládání…" : "Uložit"}
        </button>
        <button
          onClick={() => router.push("/admin")}
          className="rounded border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Zrušit
        </button>
      </div>
    </div>
  );
};

export default ConfigPage;
