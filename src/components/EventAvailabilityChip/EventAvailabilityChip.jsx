import React from 'react';
import PropTypes from 'prop-types';

import { Chip, Icon, Avatar } from '@material-ui/core';

const EventAvailabilityChip = ({ event, className, color = 'primary' }) => (
  (!event.times || !event.times.date || event.times.date.toDate() < new Date()) ? (
    <Chip
      className={ className }
      color={ color }
      label='Proběhlo'
      avatar={ <Avatar><Icon>hourglass_empty</Icon></Avatar> }
    />
  ) : (
    <Chip
      className={ className }
      label='Nová akce'
      color={ color === 'primary' ? 'secondary' : 'primary' }
      avatar={ <Avatar><Icon>favorite_border</Icon></Avatar> }
    />
  )
);

EventAvailabilityChip.propTypes = {
  event: PropTypes.object.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf([ 'primary', 'secondary' ])
};

export default EventAvailabilityChip;
