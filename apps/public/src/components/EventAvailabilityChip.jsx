import React from "react";
import PropTypes from "prop-types";

import { Chip, Icon } from "@mui/material";

import { timestampToDateStr } from "../utilities/firebase";
import { useEvent } from "../contexts/EventContext";

const EventAvailabilityChip = ({ sx }) => {
  const [event] = useEvent();

  return !event.date ||
    !event.date.toDate ||
    event.date.toDate() < new Date() ? (
    <Chip
      sx={sx}
      color="primary"
      label="Proběhlo"
      icon={<Icon>hourglass_empty</Icon>}
    />
  ) : (
    <Chip
      sx={sx}
      label={timestampToDateStr(event.date)}
      color="secondary"
      icon={<Icon>favorite_border</Icon>}
    />
  );
};

EventAvailabilityChip.propTypes = {
  className: PropTypes.string,
};

export default EventAvailabilityChip;
