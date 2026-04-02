"use client";

import { collection, query, where, orderBy, Query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { Banner } from "@/components/Banner";
import { SmallArticleCard } from "@/components/SmallArticleCard";
import type { Race } from "@/lib/types";

export default function RacesPage() {
  const event = useEvent();
  const [races, loading] = useCollectionData<Race>(
    query(
      collection(db, "races"),
      where("event", "==", event.id),
      orderBy("priority")
    ) as Query<Race>
  );

  if (loading || !races) return null;

  return (
    <>
      <Banner title="Strany" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        {races.map((r) => (
          <SmallArticleCard
            key={r.id}
            title={r.name}
            image={r.image}
            href={`/${event.id}/race/${r.id}`}
          />
        ))}
      </div>
    </>
  );
}
