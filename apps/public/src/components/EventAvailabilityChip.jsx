import React from "react";
import PropTypes from "prop-types";

import { Chip, Icon } from "@material-ui/core";

import { timestampToDateStr } from "../utilities/firebase";
import { useEvent } from "../contexts/EventContext";

const EventAvailabilityChip = ({ className }) => {
  const [event] = useEvent();

  return !event.date ||
    !event.date.toDate ||
    event.date.toDate() < new Date() ? (
    <Chip
      className={className}
      color="primary"
      label="Proběhlo"
      icon={<Icon>hourglass_empty</Icon>}
    />
  ) : (
    <Chip
      className={className}
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
