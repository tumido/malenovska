import { useMemo } from "react";
import { query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { PageHero } from "@/components/PageHero";
import type { Event, Gallery } from "@/lib/types";

const GalleryTile = ({ gallery, eventName }: { gallery: Gallery; eventName: string }) => (
  <a
    key={gallery.url}
    href={gallery.url}
    target="_blank"
    rel="external"
    className="group relative mb-2 block break-inside-avoid overflow-hidden rounded-lg bg-[lightgray]"
  >
    {gallery.cover?.src && (
      <img
        src={gallery.cover.src}
        alt={`${eventName} od ${gallery.author}`}
        className="w-full object-cover transition-transform group-hover:scale-105"
      />
    )}
    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-8">
      <p className="text-sm font-bold text-white">{gallery.name}</p>
      <p className="text-xs text-grey-400">Autor: {gallery.author}</p>
    </div>
  </a>
);

const GalleryPage = () => {
  const event = useEvent();
  const [galleries, loading] = useCollectionData(
    query(typedCollection<Gallery>("galleries"), where("event", "==", event.id))
  );

  const [events] = useCollectionData(
    query(typedCollection<Event>("events"), where("display", "==", true))
  );

  const [allGalleries] = useCollectionData(
    query(typedCollection<Gallery>("galleries"))
  );

  const pastGalleries = useMemo(() => {
    if (!events || !allGalleries) return [];

    const now = new Date();
    const pastEventIds = new Set(
      events
        .filter((e) => e.id !== event.id && e.type === event.type && e.date?.toDate() <= now)
        .map((e) => e.id)
    );

    const eventNames = new Map(events.map((e) => [e.id, e.name]));

    return allGalleries
      .filter((g) => pastEventIds.has(g.event))
      .map((g) => ({ gallery: g, eventName: eventNames.get(g.event) ?? "" }));
  }, [events, allGalleries, event.id, event.type]);

  if (loading || !galleries) return null;

  return (
    <>
      <PageHero title="Galerie" compact>
        <p>Fotogalerie, sdílená alba, památníčky... prostě, co se našlo.</p>
      </PageHero>

      <div className="-mx-4 min-h-screen bg-black/80 px-4 pt-8">
      <div className="mx-auto max-w-6xl px-2">
      {galleries.length > 0 ? (
        <div className="columns-2 gap-2 sm:columns-3 lg:columns-4">
          {galleries.map((tile) => (
            <GalleryTile key={tile.url} gallery={tile} eventName={event.name} />
          ))}
        </div>
      ) : (
        <p className="text-center text-grey-400">
          Zatím tu nic není. Fotky se objeví po události.
        </p>
      )}

      {pastGalleries.length > 0 && (
        <>
          <h2 className="mb-6 mt-16 font-display text-2xl font-bold text-white">
            Galerie z minulých let
          </h2>
          <div className="columns-2 gap-2 sm:columns-3 lg:columns-4">
            {pastGalleries.map(({ gallery, eventName }) => (
              <GalleryTile key={gallery.url} gallery={gallery} eventName={eventName} />
            ))}
          </div>
        </>
      )}
      </div>
      </div>
    </>
  );
};

export default GalleryPage;
