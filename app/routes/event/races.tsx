import { query, where, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { Banner } from "@/components/Banner";
import { SmallArticleCard } from "@/components/SmallArticleCard";
import type { Race } from "@/lib/types";

const RacesPage = () => {
  const event = useEvent();
  const [races, loading] = useCollectionData(
    query(
      typedCollection<Race>("races"),
      where("event", "==", event.id),
      orderBy("priority")
    )
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
};

export default RacesPage;
