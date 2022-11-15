import React, { useEffect } from "react";
import { renderToString } from "react-dom/server";
import PropTypes from "prop-types";
import { MapContainer as BaseMapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import { latLngBounds, divIcon } from "leaflet";
import { Grid, Icon } from "@mui/material";

import "leaflet/dist/leaflet.css";
import { styled } from "@mui/system";
import { palette } from "../utilities/theme";

const Centerer = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center, map]);

  return null;
};

const MapContainer = styled(BaseMapContainer)({
  flexGrow: 1,
  width: "100%",
})

const Map = ({ markers, center }) => {
  const markersToRender = markers.map((marker, index) => (
    <Marker
      key={`point_${index}`}
      position={[marker.latitude, marker.longitude]}
      icon={divIcon({
        html: renderToString(
          <Icon  style={{ fontSize: "48px", color: palette.loading[index % 3] }}>
            location_on
          </Icon>
        ),
        className: "", // Disables Leaflet to render a blank square
        iconAnchor: [24, 48],
        iconSize: [48,48]
      })}
    />
  ));

  return (
    <Grid container sx={{height: "100%"}}>
      <Grid item sx={{
        minHeight: "400px",
        flexGrow: 1,
        display: "flex",
        "& .leaflet-marker-icon": {
          filter: "drop-shadow(8px 8px 8px #000)",
        },
        "& .leaflet-pane": {
          zIndex: 0,
        },
        "& .leaflet-popup-content-wrapper": {
          borderRadius: 0,
        },
        "& .leaflet-popup-content": {
          margin: "1rem",
          fontSize: "1rem",
          width: "100%",
        }
      }}>
        <MapContainer
          center={latLngBounds(
            markers.map((marker) => [marker.latitude, marker.longitude])
          ).getCenter()}
          zoom={14}
        >
          <Centerer center={center} />
          <TileLayer
            url="http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png"
            attribution={renderToString(
              <React.Fragment>
                <a href="http://osm.org/copyright"> OpenStreetMap</a> and
                <a href="http://www.mtbmap.cz">MTB map Europe</a>
              </React.Fragment>
            )}
          />
          {markersToRender}
        </MapContainer>
      </Grid>
    </Grid>
  );
};

Map.propTypes = {
  markers: PropTypes.array,
  center: PropTypes.array,
};

export default Map;
