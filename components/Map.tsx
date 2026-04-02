"use client";

import dynamic from "next/dynamic";
import type { POI } from "@/lib/types";

interface MapProps {
  markers: POI[];
  center?: [number, number];
}

const MapInner = dynamic(() => import("@/components/MapInner"), { ssr: false });

export function Map({ markers, center }: MapProps) {
  return (
    <div className="min-h-[400px] w-full flex-1 [&_.leaflet-marker-icon]:drop-shadow-[8px_8px_8px_#000] [&_.leaflet-pane]:z-0">
      <MapInner markers={markers} center={center} />
    </div>
  );
}
