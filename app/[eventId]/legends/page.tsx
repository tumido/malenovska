"use client";

import { collection, query, where, orderBy, Query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { Banner } from "@/components/Banner";
import { Markdown } from "@/components/Markdown";
import { SmallArticleCard } from "@/components/SmallArticleCard";
import type { Legend } from "@/lib/types";

export default function LegendsPage() {
  const event = useEvent();
  const [legends, loading] = useCollectionData<Legend>(
    query(
      collection(db, "legends"),
      where("event", "==", event.id),
      orderBy("publishedAt")
    ) as Query<Legend>
  );

  return (
    <>
      <Banner title="Legendy">
        <Markdown content={event.description} />
      </Banner>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        {loading || !legends
          ? Array.from({ length: 3 }).map((_, i) => (
              <SmallArticleCard key={i} />
            ))
          : legends.map((l) => (
              <SmallArticleCard
                key={l.id}
                title={l.title}
                body={l.perex}
                image={l.image}
                href={`/${event.id}/legend/${l.id}`}
              />
            ))}
      </div>
    </>
  );
}
