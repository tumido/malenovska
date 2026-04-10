import { useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { latLngBounds, divIcon } from "leaflet";
import type { LatLng } from "leaflet";
import type { POI } from "@/lib/types";
import "leaflet/dist/leaflet.css";

const MARKER_COLORS = [
  "rgb(253, 38, 0)",
  "rgb(241, 238, 16)",
  "rgb(255, 145, 0)",
];

/** Default center: roughly central Czechia */
const DEFAULT_CENTER: [number, number] = [49.75, 15.75];

const FitBounds = ({ pois }: { pois: POI[] }) => {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current || pois.length === 0) return;
    const valid = pois.filter((p) => p.latitude !== 0 || p.longitude !== 0);
    if (valid.length === 0) return;
    const bounds = latLngBounds(
      valid.map((p) => [p.latitude, p.longitude] as [number, number]),
    );
    map.fitBounds(bounds.pad(0.3), { maxZoom: 15 });
    fitted.current = true;
  }, [pois, map]);

  return null;
};

const MapClickHandler = ({
  onMapClick,
}: {
  onMapClick: (latlng: LatLng) => void;
}) => {
  useMapEvents({
    dblclick: (e) => onMapClick(e.latlng),
  });
  return null;
};

const DraggableMarker = ({
  position,
  index,
  color: colorProp,
  label,
  onDragEnd,
}: {
  position: [number, number];
  index: number;
  color?: string;
  label: string;
  onDragEnd: (latlng: LatLng) => void;
}) => {
  const color = colorProp || MARKER_COLORS[index % 3];

  const icon = useMemo(
    () =>
      divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="${color}" stroke="none"><path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 7.94 8.5 15.5 8.5 15.5s8.5-7.56 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 13c-2.49 0-4.5-2.01-4.5-4.5S9.51 4 12 4s4.5 2.01 4.5 4.5S14.49 13 12 13z"/></svg>
        <div style="position:absolute;top:50px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:11px;font-weight:600;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.8);pointer-events:none">${label}</div>`,
        className: "",
        iconAnchor: [24, 48],
        iconSize: [48, 48],
      }),
    [color, label],
  );

  return (
    <Marker
      position={position}
      icon={icon}
      draggable
      eventHandlers={{
        dragend: (e) => onDragEnd(e.target.getLatLng()),
      }}
    />
  );
};

export interface AdminMapHandle {
  getCenter: () => [number, number];
}

interface AdminMapInnerProps {
  pois: POI[];
  onMarkerDrag: (index: number, lat: number, lng: number) => void;
  onMapDoubleClick: (lat: number, lng: number) => void;
}

/** Exposes map center via ref */
const CenterReporter = forwardRef<AdminMapHandle>((_props, ref) => {
  const map = useMap();
  useImperativeHandle(ref, () => ({
    getCenter: () => {
      const c = map.getCenter();
      return [c.lat, c.lng];
    },
  }));
  return null;
});

const AdminMapInner = forwardRef<AdminMapHandle, AdminMapInnerProps>(
  ({ pois, onMarkerDrag, onMapDoubleClick }, ref) => {
    const validPois = pois.filter((p) => p.latitude !== 0 || p.longitude !== 0);
    const center = validPois.length > 0
      ? [validPois[0].latitude, validPois[0].longitude] as [number, number]
      : DEFAULT_CENTER;

    return (
      <MapContainer
        center={center}
        zoom={14}
        doubleClickZoom={false}
        className="h-full min-h-80 w-full rounded"
      >
        <FitBounds pois={pois} />
        <CenterReporter ref={ref} />
        <MapClickHandler
          onMapClick={(latlng) => onMapDoubleClick(latlng.lat, latlng.lng)}
        />
        <TileLayer
          url="https://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png"
          attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> and <a href="http://www.mtbmap.cz">MTB map Europe</a>'
        />
        {pois.map((poi, i) => (
          <DraggableMarker
            key={i}
            position={[poi.latitude, poi.longitude]}
            index={i}
            color={poi.color}
            label={poi.name || `Bod ${i + 1}`}
            onDragEnd={(latlng) => onMarkerDrag(i, latlng.lat, latlng.lng)}
          />
        ))}
      </MapContainer>
    );
  },
);

export default AdminMapInner;
