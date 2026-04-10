import { lazy, Suspense } from "react";
import type { POI } from "@/lib/types";

interface MapProps {
  markers: POI[];
  center?: [number, number];
}

const MapInner = lazy(() => import("@/components/MapInner"));

export const Map = ({ markers, center }: MapProps) => {
  return (
    <div className="min-h-100 w-full flex-1 [&_.leaflet-marker-icon]:drop-shadow-[8px_8px_8px_#000] [&_.leaflet-pane]:z-0">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-100 text-grey-400">
            Načítání mapy…
          </div>
        }
      >
        <MapInner markers={markers} center={center} />
      </Suspense>
    </div>
  );
};
