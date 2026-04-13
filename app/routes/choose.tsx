import { Link } from "react-router";
import { query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Sword, Swords } from "lucide-react";
import { typedCollection } from "@/lib/firebase";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { timestampToDateStr } from "@/lib/date";
import type { Event } from "@/lib/types";

const TimelineItem = ({
  event,
  isCurrent,
  isFirst,
  isLast,
}: {
  event: Event;
  isCurrent: boolean;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const Icon = event.type ? Swords : Sword;
  const typeLabel = event.type ? "Bitva, podzim" : "Šarvátka, jaro";

  return (
    <div className="flex items-stretch">
      {/* Timeline spine */}
      <div className="flex w-10 shrink-0 flex-col items-center">
        <div
          className={`w-px flex-1 ${isFirst ? "bg-transparent" : "bg-white/20"}`}
        />
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isCurrent ? "bg-secondary/20" : "bg-white/10"}`}
        >
          <Icon
            size={18}
            className={isCurrent ? "text-secondary" : "text-white/40"}
          />
        </div>
        <div
          className={`w-px flex-1 ${isLast ? "bg-transparent" : "bg-white/20"}`}
        />
      </div>
      {/* Horizontal connector + card */}
      <div className="flex flex-1 items-center py-1.5">
        <div className="w-4 border-t border-white/20" />
        <Link to={`/${event.id}`} className="group block flex-1">
          {isCurrent ? (
            <div className="rounded-lg bg-primary-light px-4 py-3 shadow-lg transition-colors hover:bg-grey-200">
              <div className="font-display text-sm font-bold text-primary">
                {event.name}
              </div>
              <div className="text-xs text-primary/60">
                {typeLabel} {event.year} · {timestampToDateStr(event.date)}
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-white/5 px-4 py-3 transition-colors hover:bg-white/10">
              <div className="font-display text-sm font-bold text-white/80">
                {event.name}
              </div>
              <div className="text-xs text-white/40">
                {typeLabel} {event.year}
              </div>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

const ChoosePage = () => {
  const [events, loading] = useCollectionData(
    query(typedCollection<Event>("events"), where("display", "==", true)),
  );

  const now = new Date();
  const sorted = (events ?? []).sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="min-h-screen bg-black px-4">
      <PageHero title="" eventName="Malenovská" image="/background.webp">
        <p>Kdo zvítězí tentokrát? Vyber si tu bitvu, která tě zajímá.</p>
      </PageHero>

      <section className="bg-black/80 py-10">
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-grey-500/20"
                />
              ))}
            </div>
          ) : (
            sorted.map((e, i) => (
              <TimelineItem
                key={e.id}
                event={e}
                isCurrent={!e.date?.toDate || e.date.toDate() >= now}
                isFirst={i === 0}
                isLast={i === sorted.length - 1}
              />
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChoosePage;
