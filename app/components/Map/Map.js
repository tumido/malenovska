import React from 'react';
import PropTypes from 'prop-types';
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet';
import { latLngBounds } from 'leaflet';

import './style.scss';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('./map-marker.svg'),
    iconUrl: require('./map-marker.svg'),
    shadowUrl: ''
});


const Map = ( {markers, className} ) => {
  const center = []
  const markersList = []

  markers.forEach(marker => {
    let position = [marker.location.latitude, marker.location.longitude];

    center.push(position);
    markersList.push(
      <Marker
        key={`point-${marker.location.longitude}`}
        position={position}
      >
        <Popup className="custom-font">{marker.label}</Popup>
      </Marker>
    )
  })

  return (
    <div className={`Map ${className}`}>
      <LeafletMap center={latLngBounds(center).getCenter()} zoom={15} className="inner-map">
        <TileLayer
          url="http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> and <a href=&quot;http://www.mtbmap.cz&quot;>MTB map Europe</a>"
          />
        {markersList}
      </LeafletMap>
    </div>
  )
}

Map.prototype = {
  position: PropTypes.array,
  markers: PropTypes.array
}

export default Map;
