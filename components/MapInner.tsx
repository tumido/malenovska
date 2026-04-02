"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { latLngBounds, divIcon } from "leaflet";
import type { POI } from "@/lib/types";
import "leaflet/dist/leaflet.css";

const MARKER_COLORS = ["rgb(253, 38, 0)", "rgb(241, 238, 16)", "rgb(255, 145, 0)"];

function Centerer({ center }: { center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center);
  }, [center, map]);
  return null;
}

interface MapInnerProps {
  markers: POI[];
  center?: [number, number];
}

export default function MapInner({ markers, center }: MapInnerProps) {
  const bounds = latLngBounds(
    markers.map((m) => [m.latitude, m.longitude] as [number, number])
  );

  return (
    <MapContainer
      center={bounds.getCenter()}
      zoom={14}
      className="h-full min-h-[400px] w-full"
    >
      <Centerer center={center} />
      <TileLayer
        url="https://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png"
        attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> and <a href="http://www.mtbmap.cz">MTB map Europe</a>'
      />
      {markers.map((marker, index) => (
        <Marker
          key={`point_${index}`}
          position={[marker.latitude, marker.longitude]}
          icon={divIcon({
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="${MARKER_COLORS[index % 3]}" stroke="none"><path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 7.94 8.5 15.5 8.5 15.5s8.5-7.56 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 13c-2.49 0-4.5-2.01-4.5-4.5S9.51 4 12 4s4.5 2.01 4.5 4.5S14.49 13 12 13z"/></svg>`,
            className: "",
            iconAnchor: [24, 48],
            iconSize: [48, 48],
          })}
        />
      ))}
    </MapContainer>
  );
}
