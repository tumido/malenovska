import React, { useEffect } from "react";
import { renderToString } from "react-dom/server";
import PropTypes from "prop-types";
import clsx from "clsx";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import { latLngBounds, divIcon } from "leaflet";
import { Grid, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import "leaflet/dist/leaflet.css";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  map: {
    minHeight: 400,
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
    },
  },
  color0: {
    color: theme.palette.loading[0],
  },
  color1: {
    color: theme.palette.loading[1],
  },
  color2: {
    color: theme.palette.loading[2],
  },
  maximize: {
    flexGrow: 1,
    width: "100%",
  },
}));

const Centerer = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center, map]);

  return null;
};

const Map = ({ markers, center, className }) => {
  const classes = useStyles();

  const markersToRender = markers.map((marker, index) => (
    <Marker
      key={`point_${index}`}
      position={[marker.latitude, marker.longitude]}
      icon={divIcon({
        html: renderToString(
          <Icon fontSize="large" className={classes[`color${index % 3}`]}>
            location_on
          </Icon>
        ),
        className: "",
      })}
    />
  ));
  console.log(center);

  return (
    <Grid container className={clsx(`${classes.root} ${className}`)}>
      <Grid item className={classes.map}>
        <MapContainer
          center={latLngBounds(
            markers.map((marker) => [marker.latitude, marker.longitude])
          ).getCenter()}
          zoom={15}
          className={classes.maximize}
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
  className: PropTypes.string,
  center: PropTypes.array,
};

export default Map;
