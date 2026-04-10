import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { query, where, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Share2, X } from "lucide-react";
import { typedCollection } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { Banner } from "@/components/Banner";
import { Markdown } from "@/components/Markdown";
import { SmallArticleCard } from "@/components/SmallArticleCard";
import { ArticleCardHeader } from "@/components/ArticleCardHeader";
import { timestampToDateStr } from "@/lib/date";
import type { Event, Legend } from "@/lib/types";

const ShareDialog = lazy(() => import("@/components/ShareDialog"));

const LegendDialog = ({
  legend,
  eventId,
  eventName,
  onClose,
}: {
  legend: Legend;
  eventId: string;
  eventName: string;
  onClose: () => void;
}) => {
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const shareUrl = `${window.location.origin}/${eventId}/legend/${legend.id}`;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />
      <div className="fixed inset-4 z-50 mx-auto max-w-5xl overflow-y-auto rounded-lg bg-primary-light text-primary shadow-2xl md:inset-8 lg:inset-12">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
          aria-label="Zavřít"
        >
          <X size={20} />
        </button>
        <ArticleCardHeader title={legend.title} image={legend.image?.src} />
        <div className="p-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-primary px-3 py-1 text-sm text-primary">
                {eventName}
              </span>
              {legend.publishedAt && (
                <span className="rounded-full border border-primary px-3 py-1 text-sm text-primary">
                  {timestampToDateStr(legend.publishedAt)}
                </span>
              )}
            </div>
            <div className="mt-6">
              <Markdown content={legend.content} />
            </div>
          </div>
        </div>
        <div className="border-t border-primary/40 px-6 py-3">
          <button
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/60"
          >
            <Share2 size={16} />
            Sdílet
          </button>
        </div>
        <Suspense fallback={null}>
          <ShareDialog
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            title={legend.title}
            eventName={eventName}
            url={shareUrl}
          />
        </Suspense>
      </div>
    </>
  );
};

const LegendsPage = () => {
  const event = useEvent();
  const [selectedLegend, setSelectedLegend] = useState<{
    legend: Legend;
    eventId: string;
    eventName: string;
  } | null>(null);

  const [legends, loading] = useCollectionData(
    query(
      typedCollection<Legend>("legends"),
      where("event", "==", event.id),
      orderBy("publishedAt")
    )
  );

  const [events] = useCollectionData(
    query(typedCollection<Event>("events"), where("display", "==", true))
  );

  const [allLegends] = useCollectionData(
    query(typedCollection<Legend>("legends"), orderBy("publishedAt"))
  );

  const pastEventLegends = useMemo(() => {
    if (!events || !allLegends) return [];

    const now = new Date();
    const pastEvents = events
      .filter((e) => e.id !== event.id && e.type === event.type && e.date?.toDate() <= now)
      .sort((a, b) => (a.date > b.date ? -1 : 1));

    const legendsByEvent = new Map<string, Legend[]>();
    for (const l of allLegends) {
      const list = legendsByEvent.get(l.event) ?? [];
      list.push(l);
      legendsByEvent.set(l.event, list);
    }

    return pastEvents
      .map((e) => ({ event: e, legends: legendsByEvent.get(e.id) ?? [] }))
      .filter((group) => group.legends.length > 0);
  }, [events, allLegends, event.id]);

  const handleClose = useCallback(() => setSelectedLegend(null), []);

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
                onClick={() =>
                  setSelectedLegend({ legend: l, eventId: event.id, eventName: event.name })
                }
              />
            ))}
      </div>

      {pastEventLegends.length > 0 && (
        <div className="mx-auto mt-16 max-w-6xl">
          <h2 className="mb-8 font-display text-2xl font-bold text-white">
            Legendy z minulých let
          </h2>
          {pastEventLegends.map(({ event: pastEvent, legends: pastLegends }) => (
            <div key={pastEvent.id} className="mb-10">
              <h3 className="mb-4 font-display text-lg font-semibold text-grey-400">
                {pastEvent.name} ({pastEvent.year})
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {pastLegends.map((l) => (
                  <SmallArticleCard
                    key={l.id}
                    title={l.title}
                    body={l.perex}
                    image={l.image}
                    onClick={() =>
                      setSelectedLegend({ legend: l, eventId: pastEvent.id, eventName: pastEvent.name })
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedLegend && (
        <LegendDialog
          legend={selectedLegend.legend}
          eventId={selectedLegend.eventId}
          eventName={selectedLegend.eventName}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default LegendsPage;
