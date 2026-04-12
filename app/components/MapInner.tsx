import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { latLngBounds, divIcon } from "leaflet";
import type { POI } from "@/lib/types";
import "leaflet/dist/leaflet.css";

const MARKER_COLORS = [
  "rgb(253, 38, 0)",
  "rgb(241, 238, 16)",
  "rgb(255, 145, 0)",
];

const FitBoundsAndCenter = ({ markers, center }: { markers: POI[]; center?: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = latLngBounds(
        markers.map((m) => [m.latitude, m.longitude] as [number, number]),
      );
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [markers, map]);

  useEffect(() => {
    if (center) map.setView(center, 15);
  }, [center, map]);

  return null;
};

interface MapInnerProps {
  markers: POI[];
  center?: [number, number];
}

const MapInner = ({ markers, center }: MapInnerProps) => {
  const bounds = latLngBounds(
    markers.map((m) => [m.latitude, m.longitude] as [number, number]),
  );

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [60, 60] }}
      className="h-full min-h-120 w-full"
    >
      <FitBoundsAndCenter markers={markers} center={center} />
      <TileLayer
        url="https://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png"
        attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> and <a href="http://www.mtbmap.cz">MTB map Europe</a>'
      />
      {markers.map((marker, index) => {
        const color = marker.color || MARKER_COLORS[index % 3];
        return (
          <Marker
            key={`point_${index}`}
            position={[marker.latitude, marker.longitude]}
            icon={divIcon({
              html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="-1 -1 30 38" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z" fill="${color}" stroke="#212121" stroke-width="2"/><circle cx="14" cy="14" r="5" fill="#212121" opacity="0.3"/></svg>`,
              className: "",
              iconAnchor: [15, 37],
              iconSize: [30, 38],
            })}
          />
        );
      })}
    </MapContainer>
  );
};

export default MapInner;
