"use client";

import { query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { Banner } from "@/components/Banner";
import type { Gallery } from "@/lib/types";

const GalleryPage = () => {
  const event = useEvent();
  const [galleries, loading] = useCollectionData(
    query(typedCollection<Gallery>("galleries"), where("event", "==", event.id))
  );

  if (loading || !galleries) return null;

  return (
    <div className="mx-auto max-w-3xl px-2">
      <Banner title="Galerie">
        <p>Fotogalerie, sdílená alba, památníčky... prostě, co se našlo.</p>
      </Banner>
      <div className="columns-2 gap-2 sm:columns-3">
        {galleries.map((tile) => (
          <a
            key={tile.url}
            href={tile.url}
            target="_blank"
            rel="external"
            className="group relative mb-2 block break-inside-avoid overflow-hidden rounded-lg bg-[lightgray]"
          >
            {tile.cover?.src && (
              <img
                src={tile.cover.src}
                alt={`${event.name} od ${tile.author}`}
                className="w-full object-cover transition-transform group-hover:scale-105"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
              <p className="text-sm font-bold text-white">{tile.name}</p>
              <p className="text-xs text-grey-400">Autor: {tile.author}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
