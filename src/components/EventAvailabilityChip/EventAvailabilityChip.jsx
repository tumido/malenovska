import React from 'react';
import PropTypes from 'prop-types';

import { Chip, Icon, Avatar } from '@material-ui/core';

const EventAvailabilityChip = ({ event, className }) => (
  (!event.times || event.times.date.toDate() < new Date()) ? (
    <Chip
      className={ className }
      label='Proběhlo'
      avatar={ <Avatar><Icon>hourglass_empty</Icon></Avatar> }
    />
  ) : (
    <Chip
      className={ className }
      label='Nová akce'
      color="primary"
      avatar={ <Avatar><Icon>favorite_border</Icon></Avatar> }
    />
  )
);

EventAvailabilityChip.propTypes = {
  event: PropTypes.object.isRequired,
  className: PropTypes.string
}

export default EventAvailabilityChip;
