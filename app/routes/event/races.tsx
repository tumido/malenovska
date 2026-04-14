import { query, where, orderBy } from "firebase/firestore";
import { useCollectionData } from "@/lib/firestore-hooks";
import { typedCollection } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { PageHero } from "@/components/PageHero";
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
      <PageHero title="Strany" compact />
      <div className="-mx-4 min-h-screen bg-black/80 px-4 pt-8">
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
      </div>
    </>
  );
};

export default RacesPage;
